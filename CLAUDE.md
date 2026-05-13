
# peopleart.co — Corporate HQ, Brand & Investor Relations Portal

## What This Portal Is

`www.peopleart.co` / `www.peopleart.com.au` serves two interconnected roles:

1. **The PeopleArt Brand & Methodology** — The original and founding concept: reframing human interaction, leadership, strategy, marketing, teamwork, and education as **artistic disciplines**. This is what PeopleArt sells to enterprises (training, consulting, facilitation).

2. **Corporate HQ & Investor Relations** — The institutional face of Peopleart Pty Ltd, the Australian company that owns the intellectual property behind Propiología. This layer targets VCs, grant assessors, and strategic partners.

Both roles live on the same portal. The artistic identity is the brand; the corporate layer builds institutional trust.

**Tagline (original):** *"People Art — live beauty!"*

**Core Philosophy:** Human systems are artistic acts. Leaders are conductors. Teams are choreographies. Strategies are compositions. Products are sculptures. Campaigns are paintings. Education is direction.

**Vibe:** Creative-intellectual, artistic, authoritative, and trustworthy. Not aggressive marketing — elegant ideas.

**Primary Goals:**
- Present the PeopleArt methodology to enterprise buyers (HR, L&D, executives)
- Attract venture capital and impact investment (e.g., Alberts Impact Capital, Giant Leap)
- Secure non-dilutive government funding (e.g., Australian Industry Growth Program)
- Close B2B partnerships with enterprises, hospital networks, and universities
- Prove there is a serious, scientifically backed company behind the apps

**Target Audiences:**
- Enterprise HR directors, L&D managers, C-suite executives (methodology/training buyers)
- Venture capitalists and impact investors
- Government grant assessors (Australian Industry Growth Program)
- Strategic partners (universities, hospital networks, coaching firms)

See `PROPIOLOGY_ECOSYSTEM.md` for the full three-portal strategy and how this portal fits within it.
See `PEOPLEART_OLD_PORTAL.md` for the original portal concept with the six artistic archetypes.

---

## The PeopleArt Methodology — Six Artistic Archetypes

This is the **core intellectual product** of PeopleArt. Every enterprise offering maps to one of six roles drawn from the arts:

| Archetype | Art Form | Business Domain | Caption |
|-----------|----------|----------------|---------|
| **Business Conductor** | Orchestral conducting | Leadership & management | "Lead your team." |
| **Team Choreographer** | Dance / choreography | Teamwork & alignment | "All in the same direction." |
| **Action Composer** | Musical composition | Strategy & behavioral design | "Create strategies to generate the actions you want." |
| **Product Sculptor** | Pottery / sculpture | Innovation & product creation | "Create innovative products." |
| **Market Painter** | Impressionist painting | Marketing & campaigns | "Design outstanding campaigns." |
| **Education Director** | Film direction | Learning & training | "Guide the narrative." |

These archetypes must appear prominently on the site — they are the brand identity, not decorative content.

---

## The Three-Portal Ecosystem

| Portal | Role | Audience |
|--------|------|----------|
| `propiology.org` | Content, education & community hub | General public, coaches, psychologists |
| `propiology.com` | Commercial SaaS "Personal OS" | B2C subscribers, B2B enterprise clients |
| `peopleart.co` | Brand, methodology, corporate HQ & investor relations | Enterprise buyers, VCs, investors, grant assessors |

The propiology.org codebase at `C:\Users\pilot\Documents\FERNANDO\Documentos_Apps\propiology_org` is the **architectural model** for this portal. Mirror its stack and conventions.

---

## Tech Stack

Follow `propiology_org` exactly:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Backend/Auth:** AWS Amplify Gen 2 (Cognito for auth, AppSync/DynamoDB for data)
- **Storage:** AWS S3 (for secure data room documents)
- **i18n:** Custom locale routing (`/en/...`, `/es/...`) — English is default, Spanish is secondary
- **Deployment:** Vercel (with environment variables in Vercel dashboard)
- **Formatting:** Prettier (see `.prettierrc`)

---

## Project Structure

```
peopleart/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                  # Home — brand concept + corporate overview
│   │   ├── methodology/page.tsx      # The six artistic archetypes + enterprise offer
│   │   ├── about/page.tsx            # Company story, legal status, mission
│   │   ├── team/page.tsx             # Founder + advisory board
│   │   ├── rd/page.tsx               # R&D portfolio & innovation pipeline
│   │   ├── ecosystem/page.tsx        # The three-portal strategy
│   │   ├── investors/
│   │   │   ├── page.tsx              # Investor relations overview
│   │   │   └── data-room/page.tsx    # Password-protected document library
│   │   └── contact/page.tsx          # Secure contact form
│   ├── api/
│   │   └── contact/route.ts          # Contact form handler (sends email via SES)
│   └── layout.tsx
├── amplify/
│   ├── auth/resource.ts
│   ├── data/resource.ts
│   └── functions/
│       └── contactForm/resource.ts
├── components/
│   ├── providers/AmplifyProvider.tsx
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── methodology/ArchetypeCard.tsx  # Card for each artistic archetype
│   └── ui/                            # Shared UI primitives
├── lib/
│   ├── amplify/
│   ├── i18n/getTranslations.ts
│   └── utils/cn.ts
├── public/
│   ├── locales/
│   │   ├── en/                        # English translations
│   │   └── es/                        # Spanish translations
│   └── images/
│       └── methodology/               # Artistic imagery for each archetype
├── types/index.ts
├── middleware.ts                       # Locale redirect middleware
├── CLAUDE.md
├── ARCHITECTURE.md
├── PAGES.md
└── PEOPLEART_OLD_PORTAL.md            # Original portal concept (reference)
```

---

## Key Pages & Features

See `PAGES.md` for full page-by-page requirements.

**Required pages:**
1. **Home** — Hero with artistic brand concept, the six archetypes teaser, connection to Propiología science, dual CTAs (enterprise + investor)
2. **Methodology** — Full exposition of the six artistic archetypes, enterprise training offer, connection to behavioral science
3. **About** — Company history, legal status as Australian Pty Ltd, Propiología IP ownership
4. **Team** — Fernando Camacho's PhD credentials + advisory board
5. **R&D** — Innovation pipeline, proprietary algorithms, hardware prototypes
6. **Ecosystem** — High-level explanation of the three portals and how they connect
7. **Investors** — Investment thesis + password-protected Data Room (pitch decks, whitepapers, financials)
8. **Contact** — Role-segmented contact form (Enterprise / Investor / Government / Partner / Media)

---

## Authentication & Data Room

The `/investors/data-room` page is protected:
- Auth via AWS Cognito (`DataRoom` group grants access)
- Secure S3 pre-signed URLs for document downloads (never expose raw S3 paths)
- Documents: pitch deck, technical whitepapers, financial models, cap table
- Audit log: who downloaded what and when (DynamoDB `DocumentDownload` model)

---

## i18n

Same pattern as `propiology_org`:
- Middleware redirects `/` → `/en/` or `/es/` based on `Accept-Language`
- Translations live in `public/locales/{en,es}/{namespace}.json`
- Namespaces: `common`, `nav`, `home`, `methodology`, `about`, `team`, `rd`, `ecosystem`, `investors`, `contact`
- Use `getTranslations(locale, namespace)` in server components

---

## Design Principles

The old portal established a clear aesthetic that must carry forward:

- **Spacious layout** — large negative space, calm and elegant (not aggressive marketing)
- **Conceptual over commercial** — ideas first, then conversion
- **Artistic imagery** — conductors, dancers, hands on clay, impressionist paintings, film sets
- **Consistent metaphor system** — every role maps to an art form; do not break this semantic coherence
- **Philosophical tone** — the copy should feel thoughtful and intelligent, not salesy

Improvements over the old portal:
- Strong visual hierarchy with a clear hero and CTA (the old site lacked this)
- Unified imagery style (the old site mixed photography, paintings, stock images inconsistently)
- Clear value proposition above the fold — visitor must instantly understand what PeopleArt is

---

## Coding Conventions

- No `src/` directory — files live at project root
- Absolute imports via `@/` (configured in `tsconfig.json` paths)
- `cn()` utility from `lib/utils/cn.ts` for conditional class names
- No `any` in TypeScript — all types defined in `types/index.ts`
- Server components by default; use `'use client'` only when needed
- No inline styles — Tailwind only

---

## Environment Variables

```
NEXT_PUBLIC_AMPLIFY_APP_ID=
NEXT_PUBLIC_AWS_REGION=ap-southeast-2
CONTACT_FORM_RECIPIENT=f.camacho@peopleart.co
```

---

## Reference

- **Ecosystem document:** `PROPIOLOGY_ECOSYSTEM.md`
- **Old portal concept:** `PEOPLEART_OLD_PORTAL.md`
- **Architecture details:** `ARCHITECTURE.md`
- **Page requirements:** `PAGES.md`
- **Model codebase:** `C:\Users\pilot\Documents\FERNANDO\Documentos_Apps\propiology_org`
- **Existing (unfinished) site:** https://www.peopleart.co/home
- **Owner email:** f.camacho@peopleart.co
