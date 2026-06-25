import { getExperiences } from "../../../lib/data.js";

export async function GET() {
  return Response.json({ data: await getExperiences() });
}
