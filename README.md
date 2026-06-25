# MahaGetaways

MahaGetaways is a full-stack adventure tourism marketplace for Maharashtra. Travellers can discover destinations, compare experiences, review pricing and itineraries, and complete a booking with a verified local operator. MahaGetaways owns discovery, booking coordination and traveller support; operators own safety, logistics and on-ground execution.

## Hackathon overview

The project addresses a fragmented adventure-tourism journey: activity details, pricing, operator credibility and booking are often spread across social media and direct messages. MahaGetaways brings that journey into one responsive marketplace.

The current MVP demonstrates:

- Destination and activity discovery across the Sahyadris and Konkan
- Trekking, camping, rafting, scuba and rock-adventure listings
- Side-by-side comparison through consistent pricing, duration, difficulty and ratings
- Detailed itineraries, inclusions, exclusions and cancellation guidance
- Verified operator profiles and explicit on-ground handoff
- Saved experiences stored in the browser
- Booking for groups of up to 20 with international country-code support
- Server-side input validation, fee calculation and booking persistence
- A demo-safe payment authorization state that collects no card details
- Booking references, confirmation summaries and operator next steps

## Tech stack

- Next.js 16 App Router
- React 19 runtime
- HTML, CSS and browser JavaScript for the existing interactive interface
- Next.js route handlers for the API
- JSON files for MVP experience and booking storage
- Node.js 20+

The visual interface lives in `public/` and is rendered by the Next.js page. API route handlers live under `app/api/`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/experiences` | Return all marketplace experiences |
| `GET` | `/api/experiences/:id` | Return one detailed experience |
| `POST` | `/api/bookings` | Validate and create a demo booking |
| `GET` | `/api/operator/summary` | Return MVP booking, guest, payout and listing totals |

`POST /api/bookings` expects:

```json
{
  "experienceId": "harishchandragad-night-trek",
  "date": "2026-07-04",
  "guests": 2,
  "name": "Demo Traveller",
  "email": "demo@example.com",
  "phone": "+91 9876543210"
}
```

The response includes the booking reference, total amount, platform fee, operator payout and assigned operator.

## Run locally

Requirements:

- Node.js 20 or newer
- npm

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```powershell
npm run check
npm run build
```

## Suggested demo flow

1. Start on the hero and explain the two-sided marketplace model.
2. Filter by destination or activity.
3. Open an experience and show pricing, itinerary, inclusions, exclusions, cancellation guidance and the verified operator.
4. Select **Check dates & book**.
5. Change the group size to demonstrate live pricing and the clearly explained 4% platform/support fee.
6. Complete the traveller form with a valid email and phone number.
7. Submit to show the booking reference, confirmation recap and operator handoff.
8. Mention the operator summary endpoint as the foundation for a future operator dashboard.

The booking request writes a demo record to `data/bookings.json`. Clear that file back to `[]` before a fresh judging session if desired.

## Trust and marketplace model

- Listings use consistent fields so travellers can compare clearly.
- Operators are marked verified and display ratings, trip history and hosting tenure.
- Pricing separates the operator experience price from the 4% platform, coordination and support fee.
- The UI explains inclusions, exclusions and the MVP cancellation policy before checkout.
- Confirmation makes the handoff explicit: the operator supplies meeting, packing and final trip details while MahaGetaways remains the booking-support contact.
- Security headers and payload limits are configured at the application layer.

## Known MVP limitations

- Payment authorization is simulated; no card details are collected or stored.
- Bookings are stored in a local JSON file and are not suitable for concurrent production traffic.
- There is no traveller or operator authentication.
- Operator verification is represented by curated seed data rather than an onboarding workflow.
- Cancellation guidance is displayed, but automated cancellation and refund processing are not implemented.
- Email, SMS and WhatsApp notifications are represented in the confirmation experience but are not sent.
- The operator summary is an API response, not a full dashboard.
- Experience availability is illustrative and not backed by live inventory.

## Future roadmap

- PostgreSQL with transactional inventory and booking storage
- Razorpay or Stripe payment intents and signed webhooks
- Traveller and operator accounts with role-based access
- Operator onboarding, document checks and listing management
- Live availability calendars and capacity controls
- Email, SMS and WhatsApp notifications
- Cancellation, refund and rescheduling workflows
- Reviews tied to completed bookings
- Search expansion across every Maharashtra tourism region
- Operator analytics and payout dashboards

## Configuration

Copy `.env.example` to `.env.local` when adding production integrations. Never expose payment-provider secrets to browser code.

## Submission note

This repository intentionally prioritizes a polished, judgeable end-to-end MVP over production infrastructure. The marketplace story, discovery experience, listing transparency, booking flow and operator handoff are implemented; database, authentication and real payment integrations are documented roadmap items.
