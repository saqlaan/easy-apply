import fs from "fs";
import path from "path";
import clientPromise from "../../../../lib/mongodb"; // MongoDB connection
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique names
import { NextResponse } from "next/server";

// Disable bodyParser for this route, to allow form-data parsing
export const config = {
  api: {
    bodyParser: false, // Disable default body parser for multipart/form-data
  },
};

export async function POST(req, res) {
  try {
    const formData = await req.formData();

    // Extracting files and text from the form data
    const cv = formData.get("cv");
    const coverLetter = formData.get("coverLetter");
    const skillsText = formData.get("skillsText");
    const jobType = formData.get("jobType");

    if (!cv || !coverLetter || !skillsText) {
      return NextResponse.json(
        { message: "Missing required fields: cv, coverLetter, or skillsText" },
        { status: 400 }
      );
    }

    // Log the form data for debugging
    console.log("Form Data:", formData);
    console.log("CV:", cv);
    console.log("Cover Letter:", coverLetter);
    console.log("Skills:", skillsText);

    // Set up file paths (saving files to a public/uploads directory)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filenames using UUID
    const uniqueCvName = uuidv4() + path.extname(cv.name);
    const uniqueCoverLetterName = uuidv4() + path.extname(coverLetter.name);

    // Paths to save the files with unique names
    const cvPath = path.join(uploadDir, uniqueCvName);
    const coverLetterPath = path.join(uploadDir, uniqueCoverLetterName);

    // Save files to the disk
    await fs.promises.writeFile(cvPath, Buffer.from(await cv.arrayBuffer()));
    await fs.promises.writeFile(
      coverLetterPath,
      Buffer.from(await coverLetter.arrayBuffer())
    );

    // Save the data to MongoDB with the unique filenames
    const newUpload = {
      cv: uniqueCvName, // Store the unique filename in MongoDB
      coverLetter: uniqueCoverLetterName, // Store the unique filename in MongoDB
      skills: skillsText, // User's skills text
      createdAt: new Date(),
      jobType,
    };

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("userUploads");
    await collection.insertOne(newUpload);

    // Respond with success
    return NextResponse.json({
      message: "Files and skills uploaded successfully",
      data: newUpload,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { message: "Error processing upload", error: error.message },
      { status: 500 }
    );
  }
}
