---
name: testing-mavaree-email
description: Test the Mavaree email integration (Resend SDK, forgot/reset password, welcome emails, upgrade confirmations). Use when verifying email-related UI or API changes.
---

# Testing Mavaree Email Integration

## Prerequisites

### Devin Secrets Needed
- `RESEND_API_KEY` — Resend API key for sending transactional emails
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (for server-side operations)

### Test Accounts
- `testplaid@mavaree.com` / `TestPass123!` — Primary test account
- `test@mavaree.com` — Admin account

## Known Issues

### Environment Variable Swapping
The shell environment may have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` swapped (URL contains a JWT, key contains a URL). This causes "Auth not configured" errors on client-side pages.

**Fix:** Before starting the dev server, unset the bad shell vars and clear the Next.js cache:
```bash
unset NEXT_PUBLIC_SUPABASE_URL
unset NEXT_PUBLIC_SUPABASE_ANON_KEY
rm -rf .next
npm run dev
```
The correct values from `.env.local` will be used instead.

### Vercel Preview Auth
Vercel preview deployments may require Vercel authentication. Test locally with `npm run dev` if the preview URL redirects to a Vercel login page.

### Port Conflicts
Port 3000 may already be in use. Next.js will automatically try port 3001. Check the terminal output for the actual port.

## Test Procedures

### 1. Forgot Password Flow
1. Navigate to `/login`
2. Verify "Forgot password?" link is visible below password field
3. Click the link — should navigate to `/forgot-password`
4. Verify page has: Mavaree branding, email input, "Send Reset Link" button, "Back to Login" link
5. Enter a valid email and click "Send Reset Link"
6. Verify success state shows "Check your email" with the entered email displayed
7. Click "Back to Login" — should navigate back to `/login`

### 2. Reset Password Page
1. Navigate to `/reset-password` (without code param)
2. Verify page renders with: Mavaree branding, New Password field, Confirm Password field, "Update Password" button
3. Verify "Sign in" link at bottom navigates to `/login`
4. Note: Without a valid reset code, the page may show an error about invalid/expired link

### 3. Email API Endpoint
- The `/api/email` route supports types: `welcome`, `weekly_report`, `alert`
- Requires authentication (Supabase session)
- If `RESEND_API_KEY` is not set, returns preview mode response with HTML template
- Test via curl (requires valid auth token):
```bash
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -H "Cookie: <auth-cookie>" \
  -d '{"type": "welcome"}'
```

### 4. Actual Email Delivery (Requires Domain Verification)
- Resend requires domain verification for `mavaree.com` to send from `noreply@mavaree.com`
- Without verification, emails use fallback `onboarding@resend.dev`
- To verify domain: Go to Resend dashboard → Domains → Add mavaree.com → Add DNS records

### 5. Regression Tests
- Login with existing credentials should still work and redirect to dashboard
- Signup page should render without errors
- No console errors on any auth-related page

## Architecture Notes

- `src/lib/resend.ts` — Singleton Resend client, email template builders, sendEmail function
- `src/app/forgot-password/page.tsx` — Client-side forgot password form
- `src/app/reset-password/page.tsx` — Client-side reset password with PKCE code exchange
- `src/app/api/auth/webhook/route.ts` — Webhook for auto-welcome email on signup
- `src/app/api/email/route.ts` — General email API endpoint
- `src/app/api/stripe/webhook/route.ts` — Includes upgrade confirmation email logic
