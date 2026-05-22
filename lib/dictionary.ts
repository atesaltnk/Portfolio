export type Locale = "tr" | "en" | "de"

export const dictionary = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      work: "Projeler",
      about: "Hakkımda",
      process: "Süreç",
      contact: "İletişim",
    },
    hero: {
      headline: "Uçtan uca yazılım geliştiriyorum.",
      subheadline:
        "Ben Ateş — web uygulamaları, arka uç sistemleri ve sistem programlama üzerine çalışan bir yazılım geliştiriciyim. Fikirleri temiz ve güvenilir koda dönüştürüyorum.",
      primaryCta: "İletişime Geç",
      secondaryCta: "Projelerimi Gör",
      statusLine: "Staj ve iş birliklerine açığım.",
    },
    about: {
      title: "Merhaba, ben Ateş.",
      paragraph1:
        "Karmaşık problemleri temiz ve sürdürülebilir koda dönüştürmeyi seven bir yazılım geliştiriciyim — ister full-stack bir web uygulaması, ister bir arka uç servisi, ister düşük seviye bir sistem projesi olsun.",
      paragraph2:
        "Projelerimin çoğunu açık kaynak olarak geliştiriyorum. GitHub'daki her repo, baştan sona tasarlayıp geliştirdiğim ve yayına aldığım bir iş.",
      whatYouGet: "Ne Üzerine Çalışıyorum",
      bullets: [
        "Full-stack web geliştirme",
        "Arka uç & API'ler",
        "Sistemler & araçlar",
        "Temiz, test edilmiş, belgelenmiş kod",
      ],
    },
    work: {
      title: "Projelerim",
      featuredTitle: "Öne Çıkan Projeler",
      subtitle:
        "Açık kaynak projelerim, doğrudan GitHub'dan otomatik olarak güncelleniyor.",
      viewOnGitHub: "GitHub'da Gör",
      liveDemo: "Canlı",
      updated: "Güncellendi",
      allFilter: "Tümü",
      noRepos:
        "Projeler şu anda yüklenemedi. GitHub profilime göz atabilirsin.",
      viewProfile: "GitHub profilim",
    },
    capabilities: {
      title: "Neler Yapıyorum",
      techNote: "Çoğunlukla TypeScript, Python ve C++ ile çalışıyorum.",
      items: [
        {
          title: "Web Uygulamaları",
          description:
            "Next.js ve React ile modern, hızlı ve responsive web uygulamaları.",
        },
        {
          title: "Arka Uç & API'ler",
          description:
            "Ölçeklenebilir arka uç servisleri ve iyi tasarlanmış REST API'ler.",
        },
        {
          title: "Sistem Programlama",
          description:
            "C++ ile performans odaklı, düşük seviye uygulamalar ve araçlar.",
        },
        {
          title: "Otomasyon & Araçlar",
          description:
            "Tekrarlayan işleri otomatikleştiren scriptler ve geliştirici araçları.",
        },
        {
          title: "Arayüz Mühendisliği",
          description:
            "Erişilebilir, cilalı ve akıcı animasyonlara sahip kullanıcı arayüzleri.",
        },
      ],
    },
    process: {
      title: "Nasıl Çalışıyorum",
      boundary:
        "Her projeyi açık kaynak olarak, belgeleyerek geliştiriyorum.",
      steps: [
        {
          title: "Planla",
          description:
            "Problemi ve gereksinimleri netleştirir, mimariyi tasarlarım.",
        },
        {
          title: "Geliştir",
          description:
            "Temiz, modüler kodla özellikleri hayata geçiririm.",
        },
        {
          title: "Test Et",
          description:
            "Kenar durumları test eder, hataları ayıklar ve iyileştiririm.",
        },
        {
          title: "Yayınla",
          description:
            "Yayına alır, belgeler ve projeyi sürdürürüm.",
        },
      ],
    },
    faq: {
      title: "Sıkça Sorulan Sorular",
      items: [
        {
          question: "Projelerin açık kaynak mı?",
          answer:
            "Evet, çalışmalarımın çoğu GitHub'da herkese açık. Bu sitedeki Projeler bölümü doğrudan repolarımdan otomatik olarak oluşturuluyor.",
        },
        {
          question: "Hangi teknolojileri kullanıyorsun?",
          answer:
            "Web tarafında ağırlıklı olarak TypeScript ve React/Next.js, araç ve otomasyonlar için Python, sistem işleri için C++ kullanıyorum.",
        },
        {
          question: "Çalışmaya müsait misin?",
          answer:
            "Staj, freelance projeler ve iş birliklerine açığım. Bana ulaşmanın en iyi yolu iletişim sayfası.",
        },
        {
          question: "Bir projenin kodunu görebilir miyim?",
          answer:
            "Kesinlikle. Her proje kartı doğrudan ilgili GitHub reposuna bağlanıyor.",
        },
        {
          question: "Nerede yaşıyorsun?",
          answer:
            "Ankara, Türkiye'de yaşıyorum ve uzaktan çalışmaya tamamen açığım.",
        },
      ],
    },
    finalCta: {
      text: "Bir fikrin mi var, ya da birlikte çalışmak mı istiyorsun? Bana yaz.",
      button: "İletişime Geç",
    },
    form: {
      title: "İletişime Geç",
      subtitle:
        "Bir soru, bir fırsat ya da sadece merhaba demek için — formu doldur, en kısa sürede geri döneyim.",
      fullName: "Ad Soyad",
      email: "E-posta",
      subject: "Konu",
      subjectPlaceholder: "Ne hakkında?",
      message: "Mesaj",
      messagePlaceholder: "Mesajını buraya yaz...",
      submit: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      successTitle: "Teşekkürler!",
      successMessage:
        "Mesajın için teşekkürler. En kısa sürede sana geri döneceğim.",
      orReachMe: "Ya da doğrudan ulaş:",
      errors: {
        required: "Bu alan zorunludur",
        email: "Geçerli bir e-posta adresi giriniz",
      },
    },
    aboutPage: {
      title: "Hakkımda",
      intro:
        "Ben Ateş Altınkaynak. Ankara merkezli bir yazılım geliştiriciyim.",
      story:
        "Yazılıma problem çözme tutkusuyla başladım ve bu, eksiksiz ürünler geliştirmeye dönüştü. React arayüzlerinden Python araçlarına ve C++ sistem koduna kadar yığının her katmanında çalışıyorum. Temiz, okunabilir ve kalıcı kod yazmaya önem veririm.",
      stack: {
        title: "Teknolojiler",
        subtitle: "Projelerimde en sık kullandığım diller, çatılar ve araçlar.",
      },
    },
    processPage: {
      title: "Nasıl Çalışıyorum",
      intro:
        "Her projeyi sistematik ve şeffaf bir şekilde geliştiriyorum. İşte adım adım süreç:",
      collaboration: {
        title: "Birlikte Çalışırken",
        items: [
          "Net hedefler ve açık iletişim",
          "Düzenli ilerleme güncellemeleri",
          "Sürüm kontrolü ve temiz commit geçmişi",
          "Belgelenmiş, devredilebilir kod",
        ],
      },
      quality: {
        title: "Kod Kalitesi",
        description:
          "Kodun okunabilir, test edilebilir ve sürdürülebilir olmasına özen gösteririm.",
      },
      openSource: {
        title: "Açık Kaynak",
        description:
          "Projelerimin çoğu GitHub'da herkese açık — kodu incelemekten çekinme.",
      },
    },
    footer: {
      copyright: "Tüm hakları saklıdır.",
      role: "Yazılım Geliştirici",
      builtWith: "Next.js & Tailwind ile geliştirildi.",
    },
  },
  en: {
    nav: {
      home: "Home",
      work: "Projects",
      about: "About",
      process: "Process",
      contact: "Contact",
    },
    hero: {
      headline: "I build software,end to end.",
      subheadline:
        "I'm Ateş — a software developer working across web apps, backends, and systems programming. I turn ideas into clean, reliable code.",
      primaryCta: "Get in Contact",
      secondaryCta: "View My Work",
      statusLine: "Open to internships and collaboration.",
    },
    about: {
      title: "Hi, I'm Ateş.",
      paragraph1:
        "I'm a software developer who enjoys turning complex problems into clean, maintainable code — whether that's a full-stack web app, a backend service, or a low-level systems project.",
      paragraph2:
        "I build most of my projects in the open. Every repository on my GitHub is something I designed, built, and shipped end to end.",
      whatYouGet: "What I Work On",
      bullets: [
        "Full-stack web development",
        "Backends & APIs",
        "Systems & tooling",
        "Clean, tested, documented code",
      ],
    },
    work: {
      title: "My Projects",
      featuredTitle: "Featured Projects",
      subtitle:
        "My open-source projects, synced automatically straight from GitHub.",
      viewOnGitHub: "View on GitHub",
      liveDemo: "Live",
      updated: "Updated",
      allFilter: "All",
      noRepos:
        "Projects couldn't be loaded right now. You can check out my GitHub profile.",
      viewProfile: "My GitHub profile",
    },
    capabilities: {
      title: "What I Do",
      techNote: "I mostly work with TypeScript, Python, and C++.",
      items: [
        {
          title: "Web Applications",
          description:
            "Modern, fast, and responsive web apps built with Next.js and React.",
        },
        {
          title: "Backends & APIs",
          description:
            "Scalable backend services and well-designed REST APIs.",
        },
        {
          title: "Systems Programming",
          description:
            "Performance-focused, low-level applications and tools in C++.",
        },
        {
          title: "Automation & Tools",
          description:
            "Scripts and developer tools that automate the repetitive work.",
        },
        {
          title: "UI Engineering",
          description:
            "Accessible, polished interfaces with smooth, purposeful animation.",
        },
      ],
    },
    process: {
      title: "How I Work",
      boundary: "I build each project in the open, with documentation.",
      steps: [
        {
          title: "Plan",
          description:
            "Clarify the problem and requirements, then design the architecture.",
        },
        {
          title: "Build",
          description: "Implement the features with clean, modular code.",
        },
        {
          title: "Test",
          description: "Cover the edge cases, iron out bugs, and refine.",
        },
        {
          title: "Ship",
          description: "Deploy, document, and maintain the project.",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Are your projects open source?",
          answer:
            "Yes — most of my work is public on GitHub. The Projects section on this site is generated directly from my repositories.",
        },
        {
          question: "What technologies do you use?",
          answer:
            "Mainly TypeScript and React/Next.js on the web, Python for tooling and automation, and C++ for systems work.",
        },
        {
          question: "Are you available for work?",
          answer:
            "I'm open to internships, freelance projects, and collaboration. The best way to reach me is the contact page.",
        },
        {
          question: "Can I see the code behind a project?",
          answer:
            "Absolutely. Every project card links straight to its GitHub repository.",
        },
        {
          question: "Where are you based?",
          answer:
            "I'm based in Ankara, Türkiye, and fully open to working remotely.",
        },
      ],
    },
    finalCta: {
      text: "Have an idea, or want to work together? Drop me a message.",
      button: "Get in Contact",
    },
    form: {
      title: "Get in Contact",
      subtitle:
        "A question, an opportunity, or just to say hi — fill out the form and I'll get back to you soon.",
      fullName: "Full Name",
      email: "Email",
      subject: "Subject",
      subjectPlaceholder: "What's it about?",
      message: "Message",
      messagePlaceholder: "Write your message here...",
      submit: "Send Message",
      sending: "Sending...",
      successTitle: "Thank you!",
      successMessage:
        "Thanks for your message. I'll get back to you as soon as I can.",
      orReachMe: "Or reach me directly:",
      errors: {
        required: "This field is required",
        email: "Please enter a valid email address",
      },
    },
    aboutPage: {
      title: "About Me",
      intro:
        "I'm Ateş Altınkaynak, a software developer based in Ankara, Türkiye.",
      story:
        "I started programming out of a love for solving problems, and it grew into building complete products. I work across the stack — from React front-ends to Python tooling and C++ systems code. I care about writing code that is clean, readable, and built to last.",
      stack: {
        title: "Tech Stack",
        subtitle: "The languages, frameworks, and tools I work with most.",
      },
    },
    processPage: {
      title: "How I Work",
      intro:
        "I approach every project methodically and transparently. Here's the step-by-step process:",
      collaboration: {
        title: "Working Together",
        items: [
          "Clear goals and open communication",
          "Regular progress updates",
          "Version control with a clean commit history",
          "Documented, hand-off-ready code",
        ],
      },
      quality: {
        title: "Code Quality",
        description:
          "I keep code readable, testable, and maintainable.",
      },
      openSource: {
        title: "Open Source",
        description:
          "Most of my projects are public on GitHub — feel free to dig into the code.",
      },
    },
    footer: {
      copyright: "All rights reserved.",
      role: "Software Developer",
      builtWith: "Built with Next.js & Tailwind.",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      work: "Projekte",
      about: "Über mich",
      process: "Prozess",
      contact: "Kontakt",
    },
    hero: {
      headline: "Ich baue Software von vorne bis hinten.",
      subheadline:
        "Ich bin Ateş — ein Softwareentwickler, der an Web-Apps, Backends und Systemprogrammierung arbeitet. Ich verwandle Ideen in sauberen, zuverlässigen Code.",
      primaryCta: "Kontakt",
      secondaryCta: "Meine Projekte",
      statusLine: "Offen für Praktika und Zusammenarbeit.",
    },
    about: {
      title: "Hallo, ich bin Ateş.",
      paragraph1:
        "Ich bin ein Softwareentwickler, der gerne komplexe Probleme in sauberen, wartbaren Code verwandelt — ob das eine Full-Stack-Web-App, ein Backend-Service oder ein Low-Level-Systemprojekt ist.",
      paragraph2:
        "Ich entwickle die meisten meiner Projekte offen. Jedes Repository auf meinem GitHub ist etwas, das ich von Anfang bis Ende selbst designed, gebaut und veröffentlicht habe.",
      whatYouGet: "Woran ich arbeite",
      bullets: [
        "Full-Stack-Webentwicklung",
        "Backends & APIs",
        "Systeme & Tools",
        "Sauberer, getesteter, dokumentierter Code",
      ],
    },
    work: {
      title: "Meine Projekte",
      featuredTitle: "Ausgewählte Projekte",
      subtitle:
        "Meine Open-Source-Projekte, automatisch direkt von GitHub synchronisiert.",
      viewOnGitHub: "Auf GitHub anschauen",
      liveDemo: "Live",
      updated: "Aktualisiert",
      allFilter: "Alle",
      noRepos:
        "Projekte konnten nicht geladen werden. Schaue auf mein GitHub-Profil.",
      viewProfile: "Mein GitHub-Profil",
    },
    capabilities: {
      title: "Was ich mache",
      techNote: "Ich arbeite hauptsächlich mit TypeScript, Python und C++.",
      items: [
        {
          title: "Web-Anwendungen",
          description:
            "Moderne, schnelle und responsive Web-Apps mit Next.js und React.",
        },
        {
          title: "Backends & APIs",
          description:
            "Skalierbare Backend-Services und gut gestaltete REST-APIs.",
        },
        {
          title: "Systemprogrammierung",
          description:
            "Leistungsorientierte, Low-Level-Anwendungen und Tools in C++.",
        },
        {
          title: "Automatisierung & Tools",
          description:
            "Skripte und Entwickler-Tools, die repetitive Arbeit automatisieren.",
        },
        {
          title: "UI-Engineering",
          description:
            "Zugängliche, polierte Schnittstellen mit sanfter, zweckvoller Animation.",
        },
      ],
    },
    process: {
      title: "Wie ich arbeite",
      boundary: "Ich baue jedes Projekt offen, mit Dokumentation.",
      steps: [
        {
          title: "Planen",
          description:
            "Klären Sie das Problem und die Anforderungen, dann entwerfen Sie die Architektur.",
        },
        {
          title: "Bauen",
          description: "Implementiere die Features mit sauberm, modularem Code.",
        },
        {
          title: "Testen",
          description: "Abdecken der Edge Cases, Beheben von Bugs und Verfeinerung.",
        },
        {
          title: "Versand",
          description: "Bereitstellen, dokumentieren und Wartung des Projekts.",
        },
      ],
    },
    faq: {
      title: "Häufig gestellte Fragen",
      items: [
        {
          question: "Sind deine Projekte Open Source?",
          answer:
            "Ja — die meisten meiner Arbeiten sind öffentlich auf GitHub. Der Bereich Projekte auf dieser Website wird direkt aus meinen Repositories generiert.",
        },
        {
          question: "Welche Technologien verwendest du?",
          answer:
            "Hauptsächlich TypeScript und React/Next.js im Web, Python für Tools und Automatisierung, und C++ für Systemarbeiten.",
        },
        {
          question: "Stehst du zur Verfügung?",
          answer:
            "Ich bin offen für Praktika, Freiberufler-Projekte und Zusammenarbeit. Der beste Weg, mich zu erreichen, ist die Kontaktseite.",
        },
        {
          question: "Kann ich den Code hinter einem Projekt sehen?",
          answer:
            "Absolut. Jede Projektkarte verlinkt direkt auf sein GitHub-Repository.",
        },
        {
          question: "Wo bist du basiert?",
          answer:
            "Ich bin in Ankara, Türkiye ansässig und vollständig offen für Fernarbeit.",
        },
      ],
    },
    finalCta: {
      text: "Hast du eine Idee oder möchtest zusammenarbeiten? Schreib mir eine Nachricht.",
      button: "Kontakt",
    },
    form: {
      title: "Kontakt",
      subtitle:
        "Eine Frage, eine Gelegenheit oder einfach nur Hallo — fülle das Formular aus und ich antworte dir so bald wie möglich.",
      fullName: "Vollständiger Name",
      email: "E-Mail",
      subject: "Betreff",
      subjectPlaceholder: "Worum geht es?",
      message: "Nachricht",
      messagePlaceholder: "Schreibe deine Nachricht hier...",
      submit: "Nachricht senden",
      sending: "Wird gesendet...",
      successTitle: "Danke!",
      successMessage:
        "Danke für deine Nachricht. Ich antworte dir so schnell wie möglich.",
      orReachMe: "Oder kontaktiere mich direkt:",
      errors: {
        required: "Dieses Feld ist erforderlich",
        email: "Bitte gib eine gültige E-Mail-Adresse ein",
      },
    },
    aboutPage: {
      title: "Über mich",
      intro:
        "Ich bin Ateş Altınkaynak, ein Softwareentwickler mit Sitz in Ankara, Türkiye.",
      story:
        "Ich bin aus Liebe zur Problemlösung mit dem Programmieren angefangen, und es ist zu vollständigen Produkten geworden. Ich arbeite über den ganzen Stack — von React-Frontend über Python-Tools bis zum C++-Systemcode. Mir ist wichtig, Code zu schreiben, der sauber, lesbar und langlebig ist.",
      stack: {
        title: "Tech Stack",
        subtitle: "Die Sprachen, Frameworks und Tools, mit denen ich am meisten arbeite.",
      },
    },
    processPage: {
      title: "Wie ich arbeite",
      intro:
        "Ich gehe jedes Projekt methodisch und transparent an. Hier ist der Schritt-für-Schritt-Prozess:",
      collaboration: {
        title: "Zusammenarbeit",
        items: [
          "Klare Ziele und offene Kommunikation",
          "Regelmäßige Fortschrittsupdates",
          "Versionskontrolle mit sauberer Commit-Historie",
          "Dokumentierter, übergabefertiger Code",
        ],
      },
      quality: {
        title: "Codequalität",
        description:
          "Ich halte den Code lesbar, testbar und wartbar.",
      },
      openSource: {
        title: "Open Source",
        description:
          "Die meisten meiner Projekte sind öffentlich auf GitHub — schaue gerne in den Code.",
      },
    },
    footer: {
      copyright: "Alle Rechte vorbehalten.",
      role: "Softwareentwickler",
      builtWith: "Gebaut mit Next.js & Tailwind.",
    },
  },
} as const

export type Dictionary = (typeof dictionary)[Locale]
