---
name: testing-luxuryai
description: Test the LuxuryAI Next.js platform end-to-end. Covers landing page, all 8 dashboard pages, navigation, and luxury aesthetic verification.
---

# Testing LuxuryAI Platform

## Dev Server Setup

```bash
cd /home/ubuntu/repos/luxury-ai
rm -rf .next          # clear stale cache if routes changed
npm run dev
```

Server runs at `http://localhost:3000`. No backend or database required — all data is mock.

## Route Structure

- `/` — Marketing landing page (no sidebar/header)
- `/dashboard` — Main dashboard with sidebar + header layout
- `/analyzer` — Spend Analyzer
- `/optimizer` — Card Optimizer
- `/travel` — Travel & Awards
- `/health` — Points Health Monitor
- `/content` — Content Engine
- `/pricing` — Membership/Pricing
- `/crm` — CRM & Clients

The app uses Next.js route groups: `(dashboard)/` wraps internal pages with sidebar + header layout, while the root `/` renders without dashboard chrome.

## Landing Page Tests

1. Navigate to `http://localhost:3000/` — should show the marketing landing page, NOT redirect to `/dashboard`
2. Verify hero section: headline with gold gradient, two CTA buttons, 4 stat cards
3. Scroll through sections: target users (6 pills), problem ($18,400/year), 8 feature cards, how-it-works (3 steps), testimonials (3 clients with stars), pricing (3 tiers with "Most Popular" badge), CTA, footer
4. Click "Get Started" or "Log In" — should navigate to `/dashboard` with sidebar appearing

## Dashboard Page Tests

For each of the 8 dashboard pages, verify:
- Page loads without errors
- All sections and mock data render correctly
- Dark theme (#0a0a0a background) consistent
- Gold accents (#c9a96e) on key elements
- Glassmorphism cards with subtle borders
- Framer Motion animations fire on page load

## Known Issues & Patterns

### Framer Motion SSR Hydration
All components with Framer Motion animations use the `useMounted()` hook from `src/lib/utils.ts`. This prevents invisible server-rendered elements. The pattern is:

```tsx
const mounted = useMounted();
<motion.div initial={mounted ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} />
```

If content appears invisible after a hard refresh, check that new motion.div elements follow this pattern.

### Route Group Cache
After restructuring routes (e.g., moving pages into route groups), always clear `.next` cache and restart the dev server. The browser may also need cache clearing (`Ctrl+Shift+Delete`) to avoid stale client-side routing.

### Browser Cache After Route Changes
If the browser keeps redirecting to old routes after restructuring, clear browser cache and cookies for localhost, then hard-refresh.

## Aesthetic Checklist

- Dark background (#0a0a0a) throughout
- Gold gradient text on key headings
- Glassmorphism cards with backdrop blur and subtle borders
- Smooth fade-in/slide-up animations
- No visual glitches, overlapping elements, or text overflow
- Sidebar collapse/expand works (chevron toggle)

## Devin Secrets Needed

None — this is a frontend-only app with mock data. No API keys, database connections, or authentication required.
