"use client";
import Image from "next/image";
import { useState } from "react";
import { filterString } from "../../utils/functions/filterString";
import Upload from "@/components/upload/Upload";
import Skills from "@/components/skills/Skills";

export default function Home() {
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [roleType, setRoleType] = useState<"fullTime" | "wordingStudent">("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (skills.length === 0) {
      setMessage("Please add your skills");
      return;
    }

    try {
      const response = await fetch("/api/match-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillsText: filterString(skills),
          jobType: roleType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data); // Set the matched CV and Cover Letter data
        const { data: res } = data;
        console.log({ res });
        if (res.files.length > 0) {
          // if (res.coverLetter) files.push(res.coverLetter);
          // if (res.cv) files.push(res.cv);
          downloadFiles(res.files);
        } else {
          setMessage("No matching found");
        }
      } else {
        setError(data.message); // Show error message if no match found
      }
    } catch (err) {
      setError("Error connecting to the server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFiles = (fileNames: []) => {
    try {
      // Step 1: Fetch the file name from the API
      if (fileNames.length > 0) {
        // Step 2: Construct the file URL
        // const fileUrl = `/uploads/${fileName}`;  // Adjust this path based on your server setup
        fileNames.forEach((fileName) => {
          const link = document.createElement("a");
          link.href = `/uploads/${fileName}`;
          link.download = fileName; // Set the file name for download
          document.body.appendChild(link); // Append to the body
          link.click(); // Simulate a click to start downloading the file
          document.body.removeChild(link); // Clean up by removing the link from the document
        });
        // Step 3: Automatically trigger the download
      } else {
        console.error("File not found");
      }
    } catch (error) {
      console.error("Error fetching or downloading the file:", error);
    }
  };

  return (
    <div>
      <div className="grid items-center justify-items-center min-h-screen  gap-10 px-10  font-[family-name:var(--font-geist-mono)]">
        {/* Section 1 */}
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-[550px]">
          <div className="flex flex-1 flex-row items-center justify-center w-full">
            <h1 className="text-[42px] font-extrabold">Match</h1>
          </div>
          <form className="form" style={{ width: "100%" }}>
            <ol className="list-inside list-decimal text-sm text-center sm:text-left mb-5">
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-transparent w-[100%] border-gray-300 border-[1px] p-2"
                placeholder="Paste your skills here..."
              />
            </ol>
            <div className='mb-5 items-center' style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
              <h3 className="mb-3">Select Role Type</h3>
              <div className='flex flex-row gap-2'>
                <div
                  onClick={() => setRoleType("fullTime")}
                  style={{
                    backgroundColor: roleType === "fullTime" ? '#32CD32' : 'gray',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Full-Time

                </div>
                <div
                  onClick={() => setRoleType("wordingStudent")}
                  style={{
                    backgroundColor: roleType === "wordingStudent" ? '#32CD32' : 'gray',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Part-Time

                </div>
              </div>
            </div>
            <p className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] mb-5">
              {message}
            </p>
            <div className="flex items-center flex-1">
              <div
                className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSubmit}
              >
                Match
              </div>
            </div>
          </form>
          <Skills />
        </main>

        {/* Section 2 */}
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-[600px]">
          <Upload />
        </main>
      </div>

    </div>
  );
}
