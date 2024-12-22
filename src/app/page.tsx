"use client"
import Image from "next/image";
import { useState } from "react";
import { filterString } from "../../utils/functions/filterString";
import Upload from "@/components/upload/Upload";

export default function Home() {
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isFullTime, setIsFullTime] = useState(true)
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (skills.length === 0) {
      setMessage("Please add your skills")
      return
    }

    try {
      const response = await fetch("/api/match-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillsText: filterString(skills), jobType: isFullTime ? "full-time" : "working-student" }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data); // Set the matched CV and Cover Letter data
        const { data: res } = data
        const files = []
        console.log({ res })
        if (res) {
          if (res.coverLetter) files.push(res.coverLetter)
          if (res.cv) files.push(res.cv)
          downloadFiles(files);
        }
        else {
          setMessage("No matching found")
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
          const link = document.createElement('a');
          link.href = `/uploads/${fileName}`;
          link.download = fileName;  // Set the file name for download
          document.body.appendChild(link);  // Append to the body
          link.click();  // Simulate a click to start downloading the file
          document.body.removeChild(link);  // Clean up by removing the link from the document  
        })
        // Step 3: Automatically trigger the download
      } else {
        console.error('File not found');
      }
    } catch (error) {
      console.error('Error fetching or downloading the file:', error);
    }
  }

  const toggleSelection = () => {
    setIsFullTime((value) => !value); // Switch between full-time and part-time
  };

  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">
        {/* Section 1 */}
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex flex-1 flex-row items-center justify-center w-full">
            <h1 className="text-[42px] font-extrabold">Match</h1>
          </div>
          <form className="form">
            <ol className="list-inside list-decimal text-sm text-center sm:text-left mb-5">
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-transparent w-[500px] border-gray-300 border-[1px] p-2"
                placeholder="Paste your skills here..."
              />
            </ol>
            <div className="items-center" style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
              <h3 className="mb-3">Select Employment Type</h3>
              <div
                onClick={toggleSelection}
                style={{
                  backgroundColor: isFullTime ? '#32CD32' : 'gray',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {isFullTime ? 'Full-Time' : 'Part-Time'}
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
        </main>



        {/* Section 2 */}
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Upload />
        </main>


      </div>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/upload"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Upload
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
