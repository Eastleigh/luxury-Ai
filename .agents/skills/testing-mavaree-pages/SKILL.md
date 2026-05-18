---
name: testing-mavaree-pages
description: Test the Mavaree public-facing pages (homepage, signup, login, privacy, terms) end-to-end. Use when verifying landing page redesigns, brand consistency, or pricing changes.
---

# Testing Mavaree Public Pages

## Devin Secrets Needed
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (https://vmeegvjysemfgopfuywp.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- Other env vars are in `.env.local` but the above two are critical for page rendering

## Known Issues
- **Session secret override bug**: The saved session secret `NEXT_PUBLIC_SUPABASE_URL` may be misconfigured (set to a JWT token instead of a URL). If the homepage shows a Supabase "Invalid URL" error, start the dev server with:
  ```bash
  rm -rf .next
  env -u NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_URL="https://vmeegvjysemfgopfuywp.supabase.co" npx next dev
  ```
- **ROI Calculator slider drag**: Dragging range sliders may occasionally cause a transient blank screen (Framer Motion hydration edge case). Reload the page to recover. This is not reproducible consistently.

## Test Environment Setup
1. Ensure `.env.local` exists with all required env vars
2. Run `npm run dev` from the repo root
3. Navigate to `http://localhost:3000`
4. If Supabase error appears, use the `env -u` workaround above

## Pages to Test
- `/` — Homepage (hero, value cards, features, how it works, ROI calculator, trust, pricing, footer)
- `/signup` — Signup page (headline, form fields including spend dropdown and country)
- `/login` — Login page (brand consistency)
- `/privacy` — Privacy policy (brand consistency)
- `/terms` — Terms of service (brand consistency)

## Key Verification Points

### Homepage
- Hero headline: "You Spend Thousands Every Month. Mavaree Helps You Get More Back."
- Primary CTA: "Get My Free Spend Audit" → links to /signup
- Secondary CTA: "See How It Works" → scrolls to #how-it-works
- Trust microcopy: "No credit card required · Secure bank connections via Plaid · Not financial advice · US & Canada"
- 4 value cards (NOT fake stats like $2.4B, 2,400 members)
- 6 features (NOT 8 — Content Engine, Affiliate, CRM removed from homepage)
- ROI Calculator: Default $50K/mo, 1.0%, 2.5% → $6K/$15K/$9K
- Pricing: Free Audit ($0), Pro ($99/mo, Most Popular), Executive ($499/mo)
- Footer disclaimer: "not a bank, lender, financial advisor, tax advisor, or credit card issuer"
- Background color: dark navy (#0b1120), NOT pure black (#0a0a0a)

### Brand Consistency
- Logo must say "Mavaree" everywhere (not "Mava ree" with span gradient)
- Check: homepage nav, signup, login, privacy, terms, dashboard sidebar, footer

### Signup Page
- Headline: "Start with your free Mavaree Spend Audit"
- 5 fields: Full Name, Work Email, Password, Monthly Business Card Spend (dropdown), Country (dropdown)
- Spend options: Under $20K, $20K-$50K, $50K-$150K, $150K-$500K, $500K+
- Country options: United States, Canada
- Trust bullets: "No credit card required", "Secure bank connections via Plaid", "Cancel anytime", "US & Canada only"

### Nav Links
- Features → #features
- How It Works → #how-it-works
- ROI Calculator → #roi-calculator
- Pricing → #pricing
- Log In → /login
- Get Started → /signup

## Test Account
- Email: testplaid@mavaree.com / Password: TestPass123!
- Live URL: https://mavaree.com
- Vercel preview URLs follow pattern: luxury-ai-git-{branch}-jamrocks-projects-28c401ab.vercel.app
