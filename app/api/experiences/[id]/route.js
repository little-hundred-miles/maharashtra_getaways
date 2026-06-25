import { getExperiences } from "../../../../lib/data.js";

export async function GET(_request, { params }) {
  const { id } = await params;
  const experiences = await getExperiences();
  const experience = experiences.find((item) => item.id === id);

  return experience
    ? Response.json({ data: experience })
    : Response.json({ error: "Experience not found" }, { status: 404 });
}
