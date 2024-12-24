import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

// API handler function for POST requests to match skills with uploaded data
export async function POST(req, res) {
  try {
    // Parse the request body
    const { skillsText, jobType } = await req.json();

    if (!skillsText) {
      return NextResponse.json({
        message: "Skills text is required",
      });
    }

    // Preprocess input skills
    const preprocessSkills = (skills) => {
      return [
        ...new Set(
          skills
            .split(",")
            .map((skill) => skill.trim().toLowerCase())
            .filter((skill) => skill)
        ),
      ]; // Remove duplicates and empty strings
    };

    const inputSkillsList = preprocessSkills(skillsText);

    // Connect to MongoDB and get the collection
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("userUploads");

    // Fetch all documents from the collection
    const uploads = await collection.find({ jobType }).toArray();

    if (uploads.length === 0) {
      return NextResponse.json({
        message: "No uploaded data found",
      });
    }

    const matchesFound = uploads
      .map((entry) => {
        const entrySkillsArray = preprocessSkills(entry.skills);
        // Calculate the number of matching skills
        let matchCount = 0;
        inputSkillsList.forEach((inputSkill) => {
          entrySkillsArray.forEach((entrySkill) => {
            if (entrySkill.toLowerCase().includes(inputSkill.toLowerCase())) {
              matchCount++;
            }
          });
        });
        return {
          title: entry.title,
          matchCount,
          id: entry._id,
          files: entry.files,
        };
      })
      .filter((entry) => entry.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (matchesFound.length === 0) {
      return NextResponse.json({
        message: "No matching data found for the provided skills",
      });
    }

    // Return matched data with id and title
    return NextResponse.json({
      message: "Matching data found",
      data: matchesFound[0],
    });
  } catch (error) {
    console.error("Error during matching:", error);
    return NextResponse.json({
      message: "Error processing the request",
      error,
    });
  }
}
