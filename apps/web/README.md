## Remote OK homepage prototype

This app recreates the Remote OK jobs listing homepage in Next.js using CSS Modules and custom design tokens. The layout is fully responsive (mobile → desktop), accessible, and uses interactive filters and search suggestions backed by fixture data.

### Getting started

Install dependencies at the repo root (`npm install`) if you haven’t already, then run the web app:

```bash
npm run dev --workspace web
# or
pnpm --filter web dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the page. Hot reloading is enabled for edits inside `apps/web/app`.

### Fonts

The Caveat font is imported globally from Google Fonts inside `app/globals.css` using:

```css
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap");
```

Utility classes for the brand and hero typography are exposed as `.caveat-logo`, `.caveat-title`, and `.caveat-title--lg`.

### Design tokens

Reusable color, radii, and spacing tokens live in `:root` within `app/globals.css`. Key tokens:

- `--color-page-bg`: `#FBF9F7`
- `--color-primary`: `#1766E6`
- `--color-purple`: `#5B3BFF`
- `--color-teal`: `#4BC1BA`
- `--radius-xl`: `28px`
- `--radius-pill`: `999px`

You can consume these variables in new components or expose them through a design system if needed.

### Page structure

- **Header** with brand mark and pills (Health insurance, Post a job, Log in)
- **Hero banner** for employer CTA with dismiss control
- **Search & filters row** featuring typeahead suggestions, dropdown filters, tag chips, and sort control
- **Sponsored ad band** for promotional content
- **Job list** rendered from `app/data/jobFixtures.ts`, including animated cards, hover/focus states, tag toggles, and accessible links to detail slugs

Interactivity (filters, tags, sorting, hide hero) is handled client-side in `app/page.tsx`.

### Assets

Place the provided screenshot reference at `apps/web/public/fff05278-4e75-4302-8739-6f0b8a397440.png` if you want to surface it in documentation or previews.

### Testing & linting

```bash
npm run lint --workspace web
```

Additional tasks (type checking, builds) are defined in `apps/web/package.json`.

## Remote OK product overview

Remote OK is a global, remote-only job marketplace connecting employers and candidates across categories such as software development, design, marketing, and support. Job seekers browse and filter remote listings, while employers publish paid postings and boost visibility with premium placements. The platform emphasises flexibility, worldwide reach, and low-friction hiring experiences.

### Core routes & page purposes

| Route | Description | Key elements |
| --- | --- | --- |
| `/` | Homepage / main listing | Latest remote roles, filters (category, salary, tags, location), featured banner, CTAs to hire/post |
| `/remote-jobs` | Primary job listing index | Grid/list of remote roles with company, location scope, tags, salary (if provided) |
| `/remote-jobs/<slug>-<job-id>` | Job detail | Full description, company info, salary/benefits, contract type, how-to-apply instructions |
| `/hire-remotely` | Employer “hire” page | Pricing, reach stats, product benefits, testimonials, guidance for employers |
| `/post-job` | Job submission flow | Form inputs for company, title, skills/tags, employment type, location filters, salary range, application instructions, payment |
| `/login`, `/signup` | Account access | Manage employer posts, invoices, or job-seeker alerts |
| `/rss`, `/json`, `/txt` | Feeds / API | Machine-readable job feeds for integrations |
| `/remote-<category>-jobs` | Category-specific listings | Pre-filtered jobs per discipline (e.g. design, marketing) |
| Location-filtered paths/queries | Geography-specific views | Restrict roles by country or worldwide availability |
| `/changelog`, `/ideas-and-bugs`, `/faq` | Support & meta pages | Help docs, feedback intake, product updates |

### Features & considerations

- Remote-first inventory; office-bound roles are excluded.
- Global reach: major companies (Amazon, Microsoft, Stripe, etc.) leverage the board to reach distributed talent.
- Robust tag/filter system across skills, seniority, and contract types for fast discovery.
- Premium offerings (featured/stickied posts, bundles, location targeting) drive employer revenue.
- Public feeds (RSS/JSON/TXT) power integrations and aggregators.
- Operated by a lean team; primarily monetised via employer posting fees while job seekers browse free.
- Coverage skews toward tech/digital roles; non-tech hiring volume can be lower.

### Reusable explanation prompt

```
Describe the product and major web-routes of Remote OK.
Remote OK is an online job board focused purely on remote work. Job-seekers can browse and apply to remote jobs worldwide, across categories such as software development, design, marketing, customer support and more. Employers can post remote-job listings, pay for premium placement, and reach a global talent pool. The site provides job listing feeds for aggregation and offers category and location filters. The business model is based on employer-listing fees and premium features, while job-seekers use the platform free. Remote OK emphasises global-remote, tag-based filtering, simplicity of UI and minimal friction.
Major routes and what each contains:
/ : Homepage with latest remote-jobs feed, navigation, filters (category, tags, location)
/remote-jobs : Full listing page of remote job posts
/remote-jobs/<slug>-<job-id> : Job-detail page with full description, company, tags, salary/contract info, how-to-apply
/hire-remotely : Employer landing page; describes how to hire remote talent, pricing/packages, benefits
/post-job : Form for employer to create a job listing (company details, job title, tags, location/remote status, description, how to apply, payment)
/login / /signup : User account access for job-seekers and/or employers
/rss, /json, /txt : Feeds or API endpoints providing job-listing data in different formats
/remote-<category>-jobs (e.g., /remote-design-jobs) : Listings filtered to a specific job category/skillset
Country or location filtered listing routes (via query parameter or path): listings for specific country or “Worldwide” remote
/faq, /changelog, /ideas-and-bugs : Support / documentation / feedback pages
Key features & items to know:
Focus exclusively on remote work (no office-bound roles)
Global reach: job-seekers and employers anywhere in the world
Tag & category filtering (skill-tags, employment-type, contract-type)
Premium employer features (featured posts, bundles, location restrictions)
Job-listing feeds for programmatic access
Minimal, clean UI and navigation, emphasis on remote-work ethos
Business model: employer pays; job-seeker mostly free
Architecture: thousands of dynamically generated job-detail pages based on slug + id pattern
```
