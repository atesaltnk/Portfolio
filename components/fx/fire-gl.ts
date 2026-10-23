/**
 * GPU renderer for the ASCII fire. The 2D path issues one drawImage per glyph
 * cell — thousands per frame, all serialised on the main thread. Here the heat
 * grid is uploaded as a tiny texture and a single fragment shader copies the
 * matching glyph out of the same pre-rendered atlas, pixel for pixel, so the
 * output is identical while the per-frame cost drops to one draw call.
 */

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

// Mirrors drawImage(atlas, v*cw*dpr, 0, cw*dpr, ch*dpr, x*cw, y*ch, cw, ch):
// a device pixel inside cell (x, y) samples the atlas at the same offset
// inside glyph column v. Cells below heat 3 and the fuel row stay empty.
const FRAGMENT = `
precision highp float;
uniform sampler2D uHeat;
uniform sampler2D uAtlas;
uniform vec2 uGrid;
uniform vec2 uCell;
uniform vec2 uAtlasSize;
uniform float uDpr;
uniform float uHeight;
void main() {
  vec2 css = vec2(gl_FragCoord.x, uHeight - gl_FragCoord.y) / uDpr;
  vec2 cell = floor(css / uCell);
  if (cell.y >= uGrid.y - 1.0) { gl_FragColor = vec4(0.0); return; }
  float v = floor(texture2D(uHeat, (cell + 0.5) / uGrid).r * 255.0 + 0.5);
  if (v < 3.0) { gl_FragColor = vec4(0.0); return; }
  vec2 src = (vec2(v * uCell.x, 0.0) + css - cell * uCell) * uDpr;
  gl_FragColor = texture2D(uAtlas, src / uAtlasSize);
}
`

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: true,
  premultipliedAlpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: false,
  powerPreference: "low-power",
}

function compile(gl: WebGLRenderingContext) {
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = shader(gl.VERTEX_SHADER, VERTEX)
  const fs = shader(gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

function usable(gl: WebGLRenderingContext) {
  const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
  return Boolean(highp && highp.precision > 0)
}

let support: boolean | null = null

/**
 * Probed once on a throwaway canvas: a canvas that has handed out a WebGL
 * context can never fall back to 2D, so the real one only asks when it's safe.
 */
export function supportsFireGL(): boolean {
  if (support !== null) return support
  support = false
  try {
    const gl = document.createElement("canvas").getContext("webgl", CONTEXT_OPTIONS)
    if (gl) {
      support = usable(gl) && compile(gl) !== null
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  } catch {
    support = false
  }
  return support
}

export interface FireGL {
  setAtlas(atlas: HTMLCanvasElement, cw: number, ch: number, dpr: number): void
  resize(cols: number, rows: number): void
  draw(heat: Uint8Array): void
}

export function createFireGL(canvas: HTMLCanvasElement, onRestore: () => void): FireGL | null {
  const gl = canvas.getContext("webgl", CONTEXT_OPTIONS)
  if (!gl) return null

  let program: WebGLProgram | null = null
  let heatTex: WebGLTexture | null = null
  let atlasTex: WebGLTexture | null = null
  let loc: Record<string, WebGLUniformLocation | null> = {}
  let atlasSource: HTMLCanvasElement | null = null
  let cell = [0, 0]
  let dpr = 1
  let grid = [0, 0]

  const texture = (unit: number, filter: number) => {
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return tex
  }

  const uploadAtlas = () => {
    if (!atlasSource) return
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, atlasTex)
    // The canvas already holds premultiplied pixels; keep them as they are.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasSource)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.uniform2f(loc.uAtlasSize, atlasSource.width, atlasSource.height)
    gl.uniform2f(loc.uCell, cell[0], cell[1])
    gl.uniform1f(loc.uDpr, dpr)
  }

  const allocHeat = () => {
    if (!grid[0] || !grid[1]) return
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, heatTex)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, grid[0], grid[1], 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, null)
    gl.uniform2f(loc.uGrid, grid[0], grid[1])
  }

  const init = () => {
    program = compile(gl)
    if (!program) return false
    gl.useProgram(program)
    for (const name of ["uHeat", "uAtlas", "uGrid", "uCell", "uAtlasSize", "uDpr", "uHeight"]) {
      loc[name] = gl.getUniformLocation(program, name)
    }
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, "aPos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.disable(gl.BLEND)
    heatTex = texture(0, gl.NEAREST)
    atlasTex = texture(1, gl.LINEAR)
    gl.uniform1i(loc.uHeat, 0)
    gl.uniform1i(loc.uAtlas, 1)
    uploadAtlas()
    allocHeat()
    return true
  }

  if (!init()) return null

  canvas.addEventListener("webglcontextlost", (e) => e.preventDefault())
  canvas.addEventListener("webglcontextrestored", () => {
    loc = {}
    if (init()) onRestore()
  })

  return {
    setAtlas(atlas, cw, ch, ratio) {
      atlasSource = atlas
      cell = [cw, ch]
      dpr = ratio
      uploadAtlas()
    },
    resize(cols, rows) {
      grid = [cols, rows]
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(loc.uHeight, canvas.height)
      allocHeat()
    },
    draw(heat) {
      if (gl.isContextLost() || !grid[0]) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, heatTex)
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, grid[0], grid[1], gl.LUMINANCE, gl.UNSIGNED_BYTE, heat)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}
