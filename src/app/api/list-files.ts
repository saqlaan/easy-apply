import { MongoClient } from "mongodb";

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db("cv_manager");
};

export async function GET() {
  try {
    const db = await connectDB();
    const collection = db.collection("documents");
    const files = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return new Response(JSON.stringify(files), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
