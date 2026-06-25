import {
  createBooking,
  getBookings,
  getExperiences,
  saveBookings,
  validateBooking,
} from "../../../lib/data.js";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody) > 50_000) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = JSON.parse(rawBody || "{}");
    const experiences = await getExperiences();
    const error = validateBooking(body, experiences);
    if (error) return Response.json({ error }, { status: 422 });

    const experience = experiences.find((item) => item.id === body.experienceId);
    const booking = createBooking(body, experience);
    const bookings = await getBookings();
    bookings.push(booking);
    await saveBookings(bookings);

    return Response.json(
      {
        data: booking,
        message:
          "Booking confirmed. In production, payment authorization is completed by the configured provider.",
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}
