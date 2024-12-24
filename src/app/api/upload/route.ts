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
    const skillsText = formData.get("skillsText");
    const jobType = formData.get("jobType");
    const files = formData.getAll("files") || [];
    console.log("Files:", files);

    if (files.length < 0 || !skillsText) {
      return NextResponse.json(
        { message: "Missing required fields: files or skillsText" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];
    await Promise.all(
      files.map(async (file) => {
        const uniqueFileName = uuidv4() + path.extname(file.name);
        const filePath = path.join(uploadDir, uniqueFileName);

        // Push file information to uploadedFiles array
        uploadedFiles.push(uniqueFileName);

        // Write the file to the filesystem
        await fs.promises.writeFile(
          filePath,
          Buffer.from(await file.arrayBuffer())
        );
      })
    );

    const newUpload = {
      skills: skillsText, // User's skills text
      createdAt: new Date(),
      jobType,
      files: uploadedFiles,
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
