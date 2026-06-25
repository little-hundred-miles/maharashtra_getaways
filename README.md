# MahaGetaways

A full-stack adventure tourism marketplace for discovering destinations, comparing activities, viewing pricing and itineraries, and booking verified operator-run experiences across Maharashtra.

## Run locally

```powershell
npm install
npm run dev
```

Then visit `http://localhost:3000`.

The application now runs on Next.js using the App Router. The existing visual interface remains in
`public/`, while Next.js renders the page, serves the assets, applies security headers, and provides
the API route handlers.

## Included

- Responsive discovery landing page with category and region filters
- Detailed adventure listings, itineraries, inclusions, pricing, and verified operator data
- Saved experiences persisted on-device
- End-to-end booking flow with server-side validation and confirmation references
- Operator summary API (`GET /api/operator/summary`)
- Secure response headers, payload limits, and an integration-ready payment boundary

## Production payment setup

The demo authorizes a simulated payment so the entire flow works without exposing credentials. For production, replace the authorization section in `POST /api/bookings` with a server-created payment intent from a PCI-compliant provider (for example Razorpay or Stripe), then confirm bookings only from a signed webhook. Never send secret payment keys to the browser.

## Data model

Experiences live in `data/experiences.json`. Demo bookings are written to `data/bookings.json`; replace this file store with PostgreSQL or another transactional database before horizontal scaling.
