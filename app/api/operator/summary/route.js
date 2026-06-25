import { getBookings, getExperiences } from "../../../../lib/data.js";

export async function GET() {
  const [bookings, experiences] = await Promise.all([getBookings(), getExperiences()]);

  return Response.json({
    data: {
      confirmedBookings: bookings.length,
      upcomingGuests: bookings.reduce((sum, item) => sum + item.guests, 0),
      operatorPayouts: bookings.reduce((sum, item) => sum + item.operatorPayout, 0),
      activeExperiences: experiences.length,
    },
  });
}
