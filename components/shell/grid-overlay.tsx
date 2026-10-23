/** The 12-column grid every section aligns to, drawn as faint hairlines. */
export function GridOverlay() {
  return (
    <div className="grid-overlay" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  )
}
