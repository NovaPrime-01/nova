/* =============================================================================
   NOVA — CENTRAL CONTENT & CONFIGURATION
   -----------------------------------------------------------------------------
   This is the SINGLE SOURCE OF TRUTH for the entire portfolio.
   Edit the values below to update your site. No component files need changing.

   Conventions:
   - Text wrapped like [REPLACE: ...] marks an editable placeholder.
   - `preview: ""` on projects means an on-brand generated visual is shown.
     Drop an image URL/path into `preview` to use your own artwork.
   - Social `url` values point to the listed handles. Replace if different.
   ============================================================================= */

window.NOVA_DATA = {
  /* ---------------------------------------------------------------------------
     BRAND
  --------------------------------------------------------------------------- */
  brand: {
    name: "NOVA",
    role: "Digital Creator",
    // Short monogram used for the eSports identity block
    tag: "NVE",
    fullIdentity: "NOVA eSports",
    // Shown in the editorial marquee band
    keywords: ["Gaming", "Technology", "Design", "Content", "Branding", "Creative", "eSports", "AI", "Identity"],
  },

  /* ---------------------------------------------------------------------------
     SEO / META  (also mirrored in <head> of index.html)
  --------------------------------------------------------------------------- */
  meta: {
    title: "NOVA — Digital Creator & Creative Portfolio",
    description:
      "NOVA is a digital creator working at the intersection of gaming, technology and creative projects. Selected work, identity and experiments.",
    url: "https://nova.example.com",
    // Open Graph image — replace with a real hosted image when available
    ogImage: "",
  },

  /* ---------------------------------------------------------------------------
     NAVIGATION  (label + target section id)
  --------------------------------------------------------------------------- */
  nav: [
    { label: "About", id: "about" },
    { label: "Work", id: "work" },
    { label: "Gaming", id: "gaming" },
    { label: "Contact", id: "contact" },
  ],

  /* ---------------------------------------------------------------------------
     1. HERO
  --------------------------------------------------------------------------- */
  hero: {
    headline: "NOVA",
    sub: "Digital Creator • Gaming • Technology • Creative Projects",
    statement:
      "Building digital experiences, creative projects and a personal identity at the intersection of gaming, technology and culture.",
    status: "Available for collaborations",
    scrollLabel: "Scroll",
  },

  /* ---------------------------------------------------------------------------
     3. ABOUT
  --------------------------------------------------------------------------- */
  about: {
    label: "01 — About",
    heading: "Who is NOVA?",
    paragraphs: [
      "A digital creator exploring gaming, technology, design, content and digital entrepreneurship.",
      "NOVA is less a title and more a direction — a personal identity built through consistent work, curiosity and a willingness to experiment in public.",
    ],
    facts: [
      { label: "Based in", value: "Uttarakhand, India" },
      { label: "Focus", value: "Gaming · Technology · Design" },
      { label: "Creating content since", value: "2024" },
      { label: "Working since", value: "2025 – 2026" },
    ],
    timeline: [
      { year: "2024", text: "Started creating content and exploring digital projects." },
      { year: "2025", text: "Conceived the NOVA eSports identity and competitive gaming direction." },
      { year: "2026", text: "Expanded into design, branding and technology experiments." },
      { year: "Now", text: "Building a cohesive digital identity across platforms and projects." },
    ],
  },

  /* ---------------------------------------------------------------------------
     4. WHAT I DO
  --------------------------------------------------------------------------- */
  whatIDo: {
    label: "02 — What I Do",
    heading: "Capabilities",
    items: [
      {
        num: "01",
        title: "Content",
        desc: "Gaming content, social media content and digital storytelling.",
        detail:
          "Short-form and long-form storytelling across platforms, with an emphasis on consistency, editing craft and an authentic personal voice.",
      },
      {
        num: "02",
        title: "Gaming",
        desc: "Free Fire, competitive gaming and eSports.",
        detail:
          "Competitive play, community building and the broader culture of eSports — treated as a serious creative discipline, not just a pastime.",
      },
      {
        num: "03",
        title: "Design",
        desc: "Brand identity, graphics, visual concepts and digital aesthetics.",
        detail:
          "Visual systems, logos, and motion-minded graphics that hold together across platforms and feel intentional rather than templated.",
      },
      {
        num: "04",
        title: "Technology",
        desc: "Websites, AI tools, digital experiments and technology projects.",
        detail:
          "Prototyping ideas with code — from personal websites to small AI-assisted tools — to turn concepts into things people can actually use.",
      },
      {
        num: "05",
        title: "Creative Projects",
        desc: "Personal experiments and digital concepts.",
        detail:
          "Self-initiated work that doesn't fit a single box: visual studies, concepts and experiments made for the sake of learning and evolution.",
      },
    ],
  },

  /* ---------------------------------------------------------------------------
     5. SKILLS / CAPABILITIES
  --------------------------------------------------------------------------- */
  skills: {
    label: "03 — Capabilities",
    heading: "Skillset",
    intro:
      "A broad, self-taught toolkit spanning creative, technical and competitive work.",
    categories: [
      {
        name: "Creative",
        items: ["Branding", "Art Direction", "Video Editing", "Motion", "Copywriting"],
      },
      {
        name: "Technology",
        items: ["HTML / CSS", "JavaScript", "Web Design", "AI Tools", "Automation"],
      },
      {
        name: "Content",
        items: ["Storytelling", "Social Strategy", "Live Streaming", "Editing", "Community"],
      },
      {
        name: "Gaming",
        items: ["Free Fire", "Competitive", "eSports", "Coaching", "Teamplay"],
      },
      {
        name: "Branding",
        items: ["Identity", "Visual Systems", "Naming", "Merch Concepts", "Positioning"],
      },
    ],
  },

  /* ---------------------------------------------------------------------------
     6. SELECTED WORK
     preview: "" -> generated on-brand visual. Add an image URL to override.
  --------------------------------------------------------------------------- */
  work: {
    label: "04 — Selected Work",
    heading: "Selected Work",
    intro: "A small selection of projects and experiments. More on request.",
    items: [
      {
        num: "01",
        title: "[Project Name]",
        category: "Branding",
        year: "[REPLACE: Year]",
        desc:
          "[REPLACE: One or two sentence description of what this project was, the goal, and your role.]",
        tools: ["Branding", "Design", "Figma"],
        preview: "",
        url: "#",
      },
      {
        num: "02",
        title: "[Project Name]",
        category: "Web / Technology",
        year: "[REPLACE: Year]",
        desc:
          "[REPLACE: Describe the website, tool or experiment and what you learned building it.]",
        tools: ["HTML", "CSS", "JavaScript"],
        preview: "",
        url: "#",
      },
      {
        num: "03",
        title: "[Project Name]",
        category: "Content",
        year: "[REPLACE: Year]",
        desc:
          "[REPLACE: Describe the content series, campaign or channel you built and its focus.]",
        tools: ["Video", "Editing", "Social"],
        preview: "",
        url: "#",
      },
      {
        num: "04",
        title: "[Project Name]",
        category: "Gaming / eSports",
        year: "[REPLACE: Year]",
        desc:
          "[REPLACE: Describe the tournament, team or eSports project and your contribution.]",
        tools: ["Free Fire", "eSports", "Team"],
        preview: "",
        url: "#",
      },
    ],
  },

  /* ---------------------------------------------------------------------------
     7. GAMING / ESPORTS
  --------------------------------------------------------------------------- */
  gaming: {
    label: "05 — Gaming",
    heading: "NOVA eSports",
    tag: "NVE",
    statement:
      "A competitive identity built on discipline, teamwork and a love for the game — expressed through a clean, modern visual language.",
    pillars: [
      { title: "Competitive", text: "Free Fire and eSports treated as a craft to be trained and respected." },
      { title: "Identity", text: "A consistent NVE visual system across overlays, socials and merch concepts." },
      { title: "Community", text: "Building a room that people want to be part of, not just watch." },
    ],
    // Selected gaming work — placeholders
    items: [
      { title: "[Tournament / Team Name]", meta: "[REPLACE: Result or role]", year: "[REPLACE: Year]" },
      { title: "[Content Series]", meta: "[REPLACE: Platform / Reach]", year: "[REPLACE: Year]" },
      { title: "[Brand Activation]", meta: "[REPLACE: Short note]", year: "[REPLACE: Year]" },
    ],
  },

  /* ---------------------------------------------------------------------------
     8. CREATIVE PROJECTS  (editorial gallery)
     preview: "" -> generated visual.
  --------------------------------------------------------------------------- */
  creative: {
    label: "06 — Creative",
    heading: "Creative Projects",
    intro: "Experiments, studies and concepts from the workshop.",
    items: [
      { title: "[Visual Study]", category: "Visual Design", year: "[REPLACE: Year]", preview: "" },
      { title: "[Brand Concept]", category: "Branding", year: "[REPLACE: Year]", preview: "" },
      { title: "[Website Concept]", category: "Web Concept", year: "[REPLACE: Year]", preview: "" },
      { title: "[AI Experiment]", category: "AI Experiments", year: "[REPLACE: Year]", preview: "" },
      { title: "[Social Series]", category: "Social Media", year: "[REPLACE: Year]", preview: "" },
      { title: "[Motion Test]", category: "Motion", year: "[REPLACE: Year]", preview: "" },
    ],
  },

  /* ---------------------------------------------------------------------------
     9. PERSONAL PHILOSOPHY
  --------------------------------------------------------------------------- */
  philosophy: {
    label: "07 — Philosophy",
    heading: ["Building.", "Learning.", "Evolving."],
    paragraphs: [
      "I treat the work like a long game. Small, consistent reps compound into something real.",
      "Most of what I make starts as an experiment. Some fail. The ones that survive become identity.",
      "The goal isn't to look busy — it's to keep moving, keep learning, and build something that lasts.",
    ],
  },

  /* ---------------------------------------------------------------------------
     10. SOCIAL PRESENCE
     Replace `url` with your real links. Handles shown are editable too.
  --------------------------------------------------------------------------- */
  social: [
    { platform: "Instagram", handle: "real.ayuxhh", url: "https://instagram.com/real.ayuxhh" },
    { platform: "YouTube", handle: "real.ayuxhh", url: "https://youtube.com/@real.ayuxhh" },
    { platform: "Discord", handle: "real.ayuxhh", url: "https://discord.com" },
  ],

  /* ---------------------------------------------------------------------------
     11. CONTACT
  --------------------------------------------------------------------------- */
  contact: {
    label: "08 — Contact",
    heading: "Let's build something.",
    email: "your@email.com", // [REPLACE: your real email]
    note: "For collaborations, projects or just to say hi.",
    cta: "Send a message",
  },

  /* ---------------------------------------------------------------------------
     FOOTER
  --------------------------------------------------------------------------- */
  footer: {
    tagline: "Digital Creator",
    note: "Designed & built as a personal digital identity.",
  },
};
