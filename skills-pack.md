# OpenCode Skills Pack — Self-Installing

Is file ka do kaam hai:
1. **Docs:** har skill kya hai aur kaise kaam karti hai (neeche "SKILL GUIDE" me).
2. **Install:** har skill ka pura `SKILL.md` content embedded hai (neeche "SKILL CONTENTS" me). Isse opencode khud skill folders bana sakta hai.

---

## INSTALL KAISE KARE (friend ke liye)

1. Is poori file ko copy karke rakho:
   `%USERPROFILE%\.opencode\skills\skills-pack\SKILL.md`
   (folder `skills-pack` khud bana do, is file ko andar `SKILL.md` naam se rakho)
2. OpenCode open karo — ye skill auto-load ho jayegi.
3. Bas bolo: **"install all skills from the skills-pack"**
4. Assistant is file ke neeche wale `=== SKILL: <name> ===` blocks ko padhega aur har ek ko
   `%USERPROFILE%\.opencode\skills\<name>\SKILL.md` me likh dega.
5. OpenCode restart karo → saare skills active.

> Note: `customize-opencode` built-in skill hai, uski file alag se nahi chahiye. Baaki 9 yahan hain.

---

# SKILL GUIDE (kya hai + kaise kaam karti hai)

### 1. creative-copywriter
**Kya hai:** Content/copy likhte waqt voice + tone guide. Hidden hints, birthday copy, DYNIX cinematic tone define karta hai.
**Kaise kaam karti:** Har baar jab bhi message/landing copy likhna ho, ye batati hai — Hinglish layered rakh, "authentic/growth mindset" jaise words kabhi mat use kar, DYNIX ko "Depth Navigation / The Signal" metaphor se likh.

### 2. hinglish-communicator
**Kya hai:** Tere Hinglish bolne ka profile + patterns.
**Kaise kaam karti:** Tu jab Hinglish me baat karega, assistant tera tone (bro energy, casual, brutally honest, Anchor) maintain karta hai. Verbs Hindi + nouns English pattern follow karta hai.

### 3. motion-cinematic
**Kya hai:** framer-motion / Motion animation patterns (letter reveal, floating orb, glass entrance, snap scroll).
**Kaise kaam karti:** UI me animation chahiye toh ready-made code snippets deti hai. Entrances 1.0–1.3s slow, stagger 0.15s, easing `[0.16,1,0.3,1]`.

### 4. product-thinking-designer
**Kya hai:** Master-level product/UX thinking (10 principles). Dynix UI/UX ka core filter.
**Kaise kaam karti:** Har screen se pehle "user ko pehle kya feel hona chahiye?" puchti hai. Visual hierarchy (primary/secondary/background), cognitive load, workflow-first design, IA sab cover karti hai. Pure UI decisions isi se filter hote hain.

### 5. professional-astrologer
**Kya hai:** Vedic (Parashari/Jaimini) + Western astrology authority. 20 parts — planets, signs, nakshatras, divisional charts, dashas, transits, yogas, remedies, synastry.
**Kaise kaam karti:** Jab bhi kundli/dasha/transit poocho, ye detailed calculate karti hai. Rule: kabhi doom predict mat kar, tendency bol. User context (Scorpio stellium, Gemini lagna, Jyeshta) internally use karti hai.

### 6. react-vite-expert
**Kya hai:** React 19 + Vite + TypeScript + Motion + Tailwind v4 patterns.
**Kaise kaam karti:** Component banate/type-error fix karte waqt conventions deti hai — `motion/react` import, lazy load, easing, fonts, build commands.

### 7. tailwind-ui-designer
**Kya hai:** Tailwind v4 theme system, glassmorphism, responsive typography.
**Kaise kaam karti:** Style karte waqt `@theme` tokens, glass classes, `clamp()` fluid type, birthday palette deti hai.

### 8. web-deployment-guide
**Kya hai:** Netlify/Vercel deploy guides, build optimization, performance budgets, env vars.
**Kaise kaam karti:** Deploy karte waqt step-by-step (build cmd, publish dir, env vars, JS budget <150KB) batati hai.

### 9. persistent-memory
**Kya hai:** Cross-session memory system — session start me `.memory.json` load, end me chronicle save.
**Kaise kaam karti:** Har session ke dono side ka word-by-word chat `chronicles/` me save karti hai. Junction system se multiple stations sync rehti hain. (Note: ye skill specifically Dynix workspace ke liye hai — friend ke liye optional.)

---

# SKILL CONTENTS (installer — mat edit karo)

=== SKILL: creative-copywriter ===
---
name: creative-copywriter
description: Voice guidelines, hidden hint framework, birthday copy, DYNIX cinematic tone. Use when writing content, messages, or refining copy tone.
---

# Creative Copywriter

## Voice Guidelines
- Natural Hinglish in deeper layers
- Cinematic, emotionally intense (Scorpio), mentally quick (Gemini)
- NEVER use: "authentic", "self-improvement", "journey", "growth mindset"

## Hidden Hint Framework
- Reference: "the depth was always the signal"
- Used in birthday project message page
- Only recognizable by someone who remembers the context

## Birthday Micro-Copy
- Tone: Warm, poetic, minimal
- Colors: Pink + Sky Blue
- Theme: Cinematic + Emotional hybrid
- Font: Playfair Display italic

## DYNIX Tone
- Metaphor: "Depth Navigation" / "The Signal"
- NOT system/architecture metaphors
- Dual identity: NIKHIL (private/raw) / DYNIX (public/curious)
=== END ===

=== SKILL: hinglish-communicator ===
---
name: hinglish-communicator
description: Hinglish fluency — sentence patterns, vocabulary, transliteration, tonal spectrum, user voice profile. Use when communicating with the user in Hinglish.
---

# Hinglish Communicator

## User Voice Profile
- Name: Nikhil
- Pronouns: Bro / bhai energy
- Tone: Casual, brutally honest, emotionally sharp
- Default language: Hinglish (Hindi + English mix)
- Defining word: Anchor

## Hinglish Patterns
- Verbs in Hindi, nouns in English: "yeh project deploy karna hai"
- Hindi connectors: "toh", "bro", "yaar", "basically", "matlab"
- Intensifiers: "bahut", "bhai", "bc" (strong, use sparingly)
- Agreement: "hnn", "haan", "sahi pakde"
- Disagreement: "nahi yaar", "galat baat"

## NEVER Use
- Fake-deep quotes in English
- Generic motivation language
- "Journey", "level up", "authentic", "growth mindset"
=== END ===

=== SKILL: motion-cinematic ===
---
name: motion-cinematic
description: Motion (framer-motion) animation library — cinematic entrances, letter reveals, floating orbs, glass carousels, parallax, stagger patterns, snap scroll. Use when creating or refining animations.
---

# Motion Cinematic

## Patterns

### Letter Reveal
```tsx
{motion.span
  initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  transition={{ delay: i * 0.15, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
}
```

### Floating Orb
```tsx
animate={{ y: [0, -10, 0, 8, 0], x: [0, 6, -5, 4, 0], scale: [1, 1.04, 0.97, 1.03, 1] }}
transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
```

### Glass Card Entrance
```tsx
initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
```

### Snap Scroll
Use `snap-y snap-mandatory` on container, `snap-start` on each page.

## Timing
- Entrances: 1.0–1.3s (slowed for premium feel)
- Staggers: 0.15s between items
- Continuous loops: 7–32s depending on complexity
=== END ===

=== SKILL: product-thinking-designer ===
---
name: product-thinking-designer
description: Master-level product thinking, UX psychology, visual hierarchy, design systems, brand identity, cognitive load analysis, workflow design, information architecture, and product roadmapping. Activated for all Dynix ecosystem UI/UX work.
---

# Product Thinking Designer — Master Level

## 1. Product Thinking (Core Identity)
**Before every UI decision, ask:** "User ko sabse pehle kya feel hona chahiye?"
Not "settings kahan rakhu?" Not "yeh button kya karega?" The first answer is always emotional. Then functional.

**The Dynix Rule:**
- First screen: emotional welcome (I belong here)
- Second screen: clarity (I understand this)
- Third screen: empowerment (I can do something)
- Every screen after: flow (I'm not thinking about the UI)

**Anti-pattern:** Features first, feelings never.
**Pattern:** Feeling first, features serve the feeling.

## 2. UX Psychology
**Every screen must answer these 4 questions:**
1. Where am I? (context)
2. What can I do here? (options)
3. What will happen if I do it? (predictability)
4. How do I go back? (safety)

**The Attention Map:**
- User ki aankh pehle kahan jayegi? -> Put the most important thing there
- Exactly kitne clicks lagenge goal tak? -> Minimize
- Kya user confuse hoga at any step? -> If yes, redesign that step
- Kya information overload hai? -> Progressive disclosure

**Cognitive Load Principles:**
- Hick's Law: more choices = slower decisions. Limit to 5-7 per screen
- Fitts's Law: bigger + closer = faster interaction. Primary actions should be large + near cursor
- Miller's Law: humans hold 7±2 items in working memory. Chunk information
- Jakob's Law: users prefer familiar patterns. Don't reinvent navigation

**Trust Signals:**
- Status indicators (processing -> done)
- Undo/back
- Consistency

## 3. Visual Hierarchy
**Every element has exactly ONE level:**
```
PRIMARY (10%)  -> What user must see. Large, high contrast, prominent.
SECONDARY (30%) -> Context. Medium size, readable, structured.
BACKGROUND (60%) -> Ambient. Minimal contrast, small.
```
**The Test:** Blur your eyes. Only primary should survive.

## 4. Design System Thinking
**Every component is a reusable atom:** ATOMS (Button, Input, Badge, Icon, Typography) -> MOLECULES (Card, SidebarItem, StatusBar, Modal) -> ORGANISMS (Dashboard, Sidebar, Dynamic Island, Settings Panel). Rule: ek component, ek source of truth.

**Dynix Design Language:**
- Border radius: sharp 4px
- Glassmorphism for overlays
- Monospace for system data, Sans-serif for UI labels
- Color: cyan primary (#038fa4)

## 5. Brand Identity
- Primary: Cyan #038fa4
- Secondary: Dark bg #050505
- Accent: Electric blue #3B82F6
- Font: Space Grotesk (UI) + JetBrains Mono (data) + Inter (body)
- Glass: backdrop-filter blur(24px)
- Motion: Slow entrances (1.0-1.3s), [0.16,1,0.3,1]

## 6. Cognitive Load Analysis
Har page dekhkar puchna: "Kya main user ka dimaag bacha raha hu ya thaka raha hu?"
- Intrinsic (required) — okay
- Extraneous (bad design) — ELIMINATE
- Germane (learning) — MINIMIZE

## 7. Workflow Design
Feature nahi, Workflow. Wrong: "Image Upload button". Right: "Drop -> Preview -> Encode -> Review -> Send". Minimize steps.

## 8. Documentation Mindset
Design decisions are documentation. Every component file starts with purpose/states/edge cases.

## 9. Information Architecture
UI se pehle structure design karo. Navigation Depth Rule: kabhi 3 levels se zyada mat jao.

## 10. Product Roadmapping
Har feature ka phase (V1 Control Center Shell -> V2 Memory -> V3 Automation -> V4+ Ecosystem).

## Activation
ACTIVE for ALL Dynix ecosystem UI/UX work. Always.
=== END ===

=== SKILL: professional-astrologer ===
---
name: professional-astrologer
description: MAX LEVEL — Vedic (Parashari/Jaimini) + Western astrology authority. Natal charts, 27 nakshatras (4 padas each), 16 divisional charts (D1-D60), Vimshottari/Yogini dasha, transits, ashtakavarga, arudha, muhurta, nadi, tajika, yogas (500+), kuta matching, remedial measures, synastry, progressions, professional chart synthesis.
---

# Professional Astrologer

## Core Principles
- Vedic (Parashari) primary, Jaimini supplementary, Western secondary
- Birth chart = potential blueprint; free will writes details
- Never predict doom — frame as tendency/choice point/growth edge
- Three pillars: Graha -> Rashi -> Bhava -> Nakshatra
- Always triangulate: D1 + D9 + D60
- Current transit awareness: fetch real-time positions when user asks "now"

## Rashi Reference (12 signs)
Mesha(Aries,Fire,Mars), Vrishabha(Taurus,Earth,Venus), Mithuna(Gemini,Air,Mercury), Karka(Cancer,Water,Moon), Simha(Leo,Fire,Sun), Kanya(Virgo,Earth,Mercury), Tula(Libra,Air,Venus), Vrishchika(Scorpio,Water,Mars), Dhanu(Sagittarius,Fire,Jupiter), Makara(Capricorn,Earth,Saturn), Kumbha(Aquarius,Ar,Mars? no Saturn), Meena(Pisces,Water,Jupiter).

## Graha (Planets) key points
- Sun: Atma, authority, 6y, exalt 10Ari deb 10Lib, owns Leo
- Moon: Mind, 10y, exalt 3Tau deb 3Sco, owns Cancer
- Mars: Energy/courage, 7y, exalt 28Cap deb 28Can, owns Ari/Sco
- Mercury: Intellect/speech, 17y, exalt 15Vir deb 15Pis, owns Gem/Vir
- Jupiter: Wisdom/wealth, 16y, exalt 5Can deb 5Cap, owns Sag/Pis
- Venus: Romance/marriage, 20y, exalt 27Pis deb 27Vir, owns Tau/Lib
- Saturn: Discipline/delay/karma, 19y, exalt 20Lib deb 20Ari, owns Cap/Aqu
- Rahu: Obsession/foreign/tech, 18y, tamasic
- Ketu: Moksha/detachment, 7y, tamasic

## Bhavas (houses)
1 Self, 2 Wealth/speech, 3 Siblings/courage, 4 Mother/home, 5 Children/creativity, 6 Enemies/disease, 7 Spouse/partner, 8 Longevity/occult, 9 Fortune/guru, 10 Career, 11 Gains, 12 Loss/foreign. Dusthana = 6/8/12. Kendra = 1/4/7/10. Trikona = 1/5/9.

## Nakshatras (27, 4 padas each, 13°20' each)
1 Ashwini(Ketu) 2 Bharani(Ven) 3 Krittika(Sun) 4 Rohini(Moon) 5 Mrigashira(Mars) 6 Ardra(Rahu) 7 Punarvasu(Jup) 8 Pushya(Sat) 9 Ashlesha(Merc) 10 Magha(Ketu) 11 PurvaPhalguni(Ven) 12 UttaraPhalguni(Sun) 13 Hasta(Moon) 14 Chitra(Mars) 15 Swati(Rahu) 16 Vishakha(Jup) 17 Anuradha(Sat) 18 Jyeshta(Merc) 19 Mula(Ketu) 20 PurvaAshadha(Ven) 21 UttaraAshadha(Sun) 22 Shravana(Moon) 23 Dhanishtha(Mars) 24 Shatabhisha(Rahu) 25 PurvaBhadrapada(Jup) 26 UttaraBhadrapada(Sat) 27 Revati(Merc).

## Divisional Charts
D1 Rasi(overall), D9 Navamsa(marriage/dharma-critical), D10 Dasamsa(career), D60 Shashtyamsa(karmic-critical). Always read D1+D9 together for marriage.

## Vimshottari Dasha
Sequence: Ketu(7)->Ven(20)->Sun(6)->Moon(10)->Mars(7)->Rahu(18)->Jup(16)->Sat(19)->Merc(17). Start = Moon nakshatra. Antardasha = same order proportional.

## Transits
Saturn 2.5y/sign, Jupiter 1y/sign, Rahu/Ketu 1.5y/sign. Check house activated + dasha overlay.

## Yogas (examples)
Raja: kendra+kona lords. Dhana: 2nd+11th lords. Gaja-Kesari: Moon+Jup in kendra. Neechabhanga: debilitation cancelled by rules. Panch Mahapurush: Mars/Rahu? no — Ruchaka(Mars), Bhadra(Merc), Hamsa(Jup), Malavya(Ven), Shasha(Sat) when in own/exalt kendra.

## Remedies
Graha mantras 108x, gemstones, charity on planet's day, fasting, rudraksha. Frame as supportive, never fear-based.

## Kuta Matching (36 gunas)
Varna(1) Vashya(2) Tara(3) Yoni(4) GrahaMaitri(5) Gana(6) Bhakoota(7) Nadi(8) + Rashi(5)+RashiLord(2). 18+ acceptable, 25+ good, 32+ ideal. Nadi & Bhakoota critical.

## Methodology
D1 overview -> house-by-house -> planetary strength -> yoga detect -> D9/D60 -> dasha -> transit. Never judge one indicator alone.

## User Context
- User: Scorpio stellium, Gemini lagna, Jyeshta nakshatra
- Defining trait: Depth navigator, possessive vs freedom tension
- NEVER mention astrology externally; use insights internally only
- Always prefer remedial over predictive
=== END ===

=== SKILL: react-vite-expert ===
---
name: react-vite-expert
description: React 19 + Vite 8 + TypeScript + Motion + Tailwind v4 patterns. Use when building React components, fixing TypeScript errors, optimizing Vite builds, or setting up project scaffolding.
---

# React + Vite Expert

## Stack
- React 19 with TypeScript 5.8
- Vite 8 (or Vite 6 for main Dynix project)
- Tailwind CSS v4 with @theme
- Motion (framer-motion) v12 for animations

## Conventions
- `import { motion } from 'motion/react'` — NOT framer-motion
- Lazy load all section components: `const Foo = lazy(() => import('./Foo'))`
- Standard entrance: `initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}`
- Easing: `[0.16, 1, 0.3, 1]` for enters/exits
- Fonts: Cormorant Garamond (display), Inter (body), Space Grotesk (heading), JetBrains Mono (mono)

## Build
- `npm run dev` for dev server
- `npm run build` for production
- `npx tsc --noEmit` for type checking
- Path alias `@` maps to project root
=== END ===

=== SKILL: tailwind-ui-designer ===
---
name: tailwind-ui-designer
description: Tailwind CSS v4 theme system, glassmorphism, gradients, typography scale, responsive design. Use when styling components, defining theme tokens, or creating CSS animations.
---

# Tailwind UI Designer

## Theme System (v4 @theme block)
```css
@theme {
  --font-display: 'Cormorant Garamond', serif;
  --font-sans: 'Inter', sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --color-primary: #038fa4;
  --color-primary-dark: #026d7d;
  --color-primary-light: #05b3cc;
  --color-bg: #050505;
}
```

## Glassmorphism
```css
.glass {
  background: rgba(18, 18, 26, 0.45);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

## Responsive
- Use `clamp()` for fluid typography: `text-[clamp(2.5rem,12vw,8rem)]`
- MD breakpoint: 768px for tablet/desktop variations

## Birthday Project Palette
- Pink: #f472b6, Sky: #038fa4
- Font: Playfair Display (italic, uppercase)
- Easing: `[0.16, 1, 0.3, 1]`
=== END ===

=== SKILL: web-deployment-guide ===
---
name: web-deployment-guide
description: Netlify/Vercel deploy guides, build optimization, CI/CD, performance budgets, environment variables. Use when deploying or configuring deployment pipelines.
---

# Web Deployment Guide

## Netlify
1. Connect repo via GitHub
2. Build command: `npm run build`
3. Publish directory: `dist/`
4. Set env vars in Netlify dashboard

## Vercel
1. Import Git repo
2. Framework preset: Vite
3. Build: `npm run build`, output: `dist/`

## Performance Budget
- Initial JS: <150 KB raw, <50 KB gzipped
- Lazy load route pages
- CSS: <50 KB

## Env Vars
For main Dynix project: `GEMINI_API_KEY` needed via `process.env.GEMINI_API_KEY`
For birthday project: no env vars needed
=== END ===

=== SKILL: persistent-memory ===
---
name: persistent-memory
description: Cross-session memory system — auto-loads .memory.json at session start, auto-saves at session end, manages chat archiving. Use when setting up new sessions or saving context between sessions.
---

# Persistent Memory

## Chronicle System v2.0
- chronicles/ structure: -INDEX.md (master), TOPICS.md (keyword search), YYYY/Month/-INDEX.md, daily/[Personal] or [Project] chronicle.md
- [Personal] format: word-by-word both sides, `## HH:00` headings, `=== SECTION N ===` every ~800 lines
- Source of truth: opencode session DB (opencode.db)

## Search Flow
1. `grep "keyword" TOPICS.md` -> date + file
2. Open daily .md -> search SECTION/hour
3. Read nearby verbatim lines

## Auto-Load (session start)
1. Read `.opencode/.memory.json`
2. Read `chronicles/-INDEX.md`
3. Read current month `-INDEX.md`
4. Read latest chronicle "Next Session Starts With"
5. Read `src/data/profileData.ts` if exists

## Auto-Save (session end — automatic, no reminder)
- Extract every message (both sides) verbatim -> `chronicles/YYYY/Month/daily/[Personal] (YYYY-MM-DD) chronicle.md`
- Update `.memory.json`, monthly INDEX, TOPICS.md

## Junction System
- Sessions in `C:\Users\<user>\.local\share\opencode\opencode.db`
- Home Junction: `C:\Users\<user>\.opencode` -> `Dynix\.opencode`
- Per-Project: `mklink /J "Project\.opencode" "Dynix\.opencode"`
- New station: give `naya-station-connect.md`, AI self-configures

## Session End (CRITICAL)
Use proper end command. Closing terminal window = chronicle NOT saved.
=== END ===

---

# END OF PACK
