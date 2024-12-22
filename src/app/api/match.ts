import { MongoClient } from "mongodb";

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db("cv_manager");
};

export async function POST(req) {
  const { jobDescription } = await req.json();
  const jobKeywords = new Set(jobDescription.toLowerCase().split(/\s+/));

  try {
    const db = await connectDB();
    const collection = db.collection("documents");
    const files = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    let bestMatch = null;
    let maxMatches = 0;

    files.forEach((file) => {
      const fileSkills = new Set(file.skills);
      const matches = [...jobKeywords].filter((keyword) =>
        fileSkills.has(keyword)
      ).length;
      if (matches > maxMatches) {
        bestMatch = file;
        maxMatches = matches;
      }
    });

    return new Response(JSON.stringify({ bestMatch, matches: maxMatches }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
