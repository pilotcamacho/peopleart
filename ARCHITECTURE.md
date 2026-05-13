# Architecture — peopleart.co

## Stack Overview

This portal mirrors the `propiology_org` codebase. Use that project as the canonical reference for patterns, folder conventions, and AWS Amplify configuration.

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Server components by default |
| Language | TypeScript (strict mode) | All types in `types/index.ts` |
| Styling | Tailwind CSS v4 | No inline styles |
| Auth | AWS Cognito via Amplify Gen 2 | Email login, Admin group |
| Database | AWS DynamoDB via AppSync (GraphQL) | Defined in `amplify/data/resource.ts` |
| Storage | AWS S3 | Pre-signed URLs only — never public paths |
| Email | AWS SES | Contact form + data room notifications |
| Deployment | Vercel | Region: `ap-southeast-2` (Sydney) |
| i18n | Custom locale middleware | `/en/...` and `/es/...` routes |
| Formatting | Prettier | Config in `.prettierrc` |

## AWS Amplify Gen 2

Amplify Gen 2 is **code-first**: all backend resources are TypeScript files under `amplify/`, deployed via the `ampx` CLI. There is no Amplify console wizard.

**All backend resources are defined and deployed in Phase 0** — before any page or feature work begins. This ensures every development phase tests against a real AWS backend.

```
amplify/
├── backend.ts          ← root entry point
├── auth/resource.ts    ← Cognito config
└── data/resource.ts    ← all DynamoDB models
```

**Key commands:**

| Command | Purpose |
|---------|---------|
| `npx ampx sandbox` | Deploy personal dev sandbox; watches for changes |
| `npx ampx sandbox --once` | Deploy once, then exit |
| `npx ampx pipeline-deploy --branch <name>` | Deploy named shared environment (staging, main) |

**`amplify_outputs.json`** is auto-generated on every deploy. It contains public identifiers only (User Pool ID, Client ID, AppSync endpoint) — no secrets. It must be committed to the repo so the Vercel build and `AmplifyProvider` can read it.

Authentication uses Cognito with two groups:

- **Admin** — Full access; manages data room documents and investor contacts
- **DataRoom** — Granted to verified investors; allows document downloads

### Auth Configuration

```ts
// amplify/auth/resource.ts
defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to PeopleArt — Verify your email',
      verificationEmailBody: (createCode) => `Your verification code is: ${createCode()}`,
    },
  },
  groups: ['Admin', 'DataRoom'],
  multifactor: { mode: 'OPTIONAL', totp: true },
})
```

### Data Models

All four models defined in `amplify/data/resource.ts` from Phase 0:

| Model | Purpose |
|-------|---------|
| `InvestorContact` | Lead capture from contact form; public create, Admin read |
| `DataRoomDocument` | Document metadata (title, s3Key, version); Admin CRUD, DataRoom read |
| `DocumentDownload` | Audit log: who downloaded what and when; owner create, Admin read |
| `DataRoomAccess` | Records when DataRoom group access was granted; Admin CRUD |

### S3 Data Room

Documents are stored in a private S3 bucket. Access is gated:

1. Investor registers interest via contact form → stored as `InvestorContact`
2. Admin reviews and promotes user to `DataRoom` group in Cognito
3. Investor logs in → server generates pre-signed S3 URL (15-minute TTL)
4. Download event is written to `DocumentDownload` for the audit log

**Never expose raw S3 paths in the client.**

## i18n Architecture

Locale routing is handled in `middleware.ts` following the same pattern as `propiology_org`:

```
/                → redirect to /en or /es (based on Accept-Language)
/en/about        → English About page
/es/about        → Spanish About page
```

Translation files live in `public/locales/{locale}/{namespace}.json`.

Server components call `getTranslations(locale, namespace)` from `lib/i18n/getTranslations.ts`.

Namespaces:

| Namespace | Pages |
|-----------|-------|
| `common` | Shared strings (buttons, labels, errors) |
| `nav` | Navigation links |
| `home` | Hero, concept teaser, six archetypes grid, metrics, CTAs |
| `methodology` | Six archetype full cards, enterprise offer, philosophy |
| `about` | Company story, legal section |
| `team` | Founder bio, advisors |
| `rd` | R&D pipeline, algorithms, prototypes |
| `ecosystem` | Three-portal strategy explanation |
| `investors` | Data room, document list, access requests |
| `contact` | Contact form labels, success/error messages |

## Artistic Imagery System

The old portal suffered from visual inconsistency (photography, paintings, and stock images mixed without a system). The new portal must establish a **unified image treatment** for the six archetypes:

- One primary image per archetype stored in `public/images/methodology/`
- Consistent crop ratio (e.g., 4:3 or 16:9 — pick one and enforce it)
- Consistent color treatment (e.g., slight desaturation + warm overlay to unify diverse source styles)
- All six images sourced or licensed together for visual cohesion

Archetype → image concept:

| Archetype | Image Concept |
|-----------|--------------|
| Business Conductor | Conductor leading full orchestra, dramatic gesture |
| Team Choreographer | Ballroom or contemporary dancers in synchronized motion |
| Action Composer | Hands writing musical notes on sheet music |
| Product Sculptor | Hands shaping clay on a pottery wheel |
| Market Painter | Impressionist cityscape painting (vivid, emotional) |
| Education Director | Film director's chair or director with clapperboard |

## Performance & SEO

This portal targets investors and grant assessors who will Google the company before any meeting. SEO is critical.

- Use Next.js `generateMetadata()` on every page for title/description/OG tags
- Structured data (JSON-LD) on Home and Team pages (`Organization`, `Person` schemas)
- Core Web Vitals: no layout shift on font load (use `next/font`), images via `next/image`
- Sitemap via `app/sitemap.ts`
- `robots.ts` to exclude `/en/investors/data-room` from indexing

## Security Considerations

- All contact form submissions are server-side (API route) — no client-side email exposure
- Data room documents served exclusively via pre-signed S3 URLs — TTL 15 minutes
- Rate-limit the contact API route (use Vercel Edge middleware or a simple in-memory counter for MVP)
- Never commit `.env.local` — all secrets in Vercel environment variables
- Amplify resources use least-privilege IAM roles (Amplify Gen 2 manages this automatically)

## Deployment

```
Production:  https://www.peopleart.co     (Vercel, main branch)
Staging:     https://staging.peopleart.co (Vercel, staging branch)
```

AWS region: `ap-southeast-2` (Sydney) — aligns with Australian legal entity and government grant requirements.
