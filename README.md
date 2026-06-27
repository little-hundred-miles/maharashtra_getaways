# MahaGetaways
A full-stack marketplace for discovering and booking outdoor adventure experiences across Maharashtra.

## About
MahaGetaways brings adventure discovery and booking into one place. Instead of searching through scattered social media pages or messaging groups, travellers can browse verified experiences, compare pricing and itineraries, and complete a booking through one platform. MahaGetaways focuses on simplifying discovery and booking, while local operators remain responsible for delivering the on-ground experience.

## Features
- Browse adventure experiences across Maharashtra
- Filter by activity or destination
- View detailed itineraries and trip information
- Compare pricing
- Book experiences through a guided booking flow
- Demo payment and booking confirmation
- Save favourite experiences
- Responsive across desktop, tablet and mobile

## Tech stack

- Next.js 16 App Router
- React 19 runtime
- HTML, CSS and browser JavaScript for the existing interactive interface
- Next.js route handlers for the API
- JSON files for experience data and local-development booking storage
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

The response includes the booking reference, total amount, platform fee, operator payout, assigned operator and persistence mode.


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
4. Select **Book**.
6. Change the group size to demonstrate live pricing and the clearly explained 4% platform fee.
7. Complete the traveller form with a valid email and phone number.
8. Continue to the simulated payment screen and confirm the demo payment.
9. Show the booking reference, confirmation recap and operator handoff.
10. Mention the operator summary endpoint as the foundation for a future operator dashboard.

When running locally, the booking request writes a demo record to `data/bookings.json`. Clear that file back to `[]` before a fresh judging session if desired. On Vercel, the same flow returns a successful confirmation without persisting the record.


## MVP limitations

- Payment authorization is simulated; no card details are collected or stored.
- Deployed bookings are confirmation simulations and are not retained after the serverless request completes.
- Local bookings use a JSON file and are not suitable for concurrent production traffic.
- There is no traveller or operator authentication.
- Operator verification is represented by curated seed data rather than an onboarding workflow.
- Cancellation guidance is displayed, but automated cancellation and refund processing are not implemented.
- Email, SMS and WhatsApp notifications are represented in the confirmation experience but are not sent.
- The operator summary is an API response, not a full dashboard.
- Experience availability is illustrative and not backed by live inventory.

## Future Improvements

- Real payment processing through Stripe
- Traveller and operator authentication
- Database and transaction storage
- Operator dashboard for managing listings and bookings
- Live availability calendars to manage capacity
- Email, SMS, and WhatsApp confirmations
- Verified traveller reviews collected automatically after completed bookings or on-ground experience

