"use client";

import { useState } from "react";
import { filterString } from "../../../utils/functions/filterString";

export default function Match() {
    const [skills, setSkills] = useState("");
    const [message, setMessage] = useState("");
    const [roleType, setRoleType] = useState<"fullTime" | "wordingStudent" | "">("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skills.trim()) {
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
                const { data: res } = data;
                if (res?.files.length > 0) {
                    downloadFiles(res.files);
                } else {
                    setMessage("No matching found");
                }
            } else {
                setMessage("Error occurred");
            }
        } catch (err) {
            console.error(err);
            setMessage("Failed to fetch data");
        }
    };

    const downloadFiles = (fileNames: string[]) => {
        try {
            if (fileNames.length > 0) {
                fileNames.forEach((fileName) => {
                    const link = document.createElement("a");
                    link.href = `/uploads/${fileName}`;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            } else {
                console.error("File not found");
            }
        } catch (error) {
            console.error("Error fetching or downloading the file:", error);
        }
    };

    const handleRoleChange = (role: "fullTime" | "wordingStudent") => {
        setRoleType(role);
    };

    return (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-[550px] mt-10">
            <h1 className="text-[42px] font-extrabold text-center w-full">Match</h1>

            <form className="w-full" onSubmit={handleSubmit}>
                <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-transparent w-full border-gray-300 border p-2 mb-5"
                    placeholder="Paste your skills here..."
                />

                <div className="mb-5 flex items-center justify-between gap-4">
                    <h3>Select Role Type</h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`${roleType === "fullTime" ? "bg-green-500" : "bg-gray-500"
                                } text-white px-4 py-2 rounded-full font-bold transition`}
                            onClick={() => handleRoleChange("fullTime")}
                        >
                            Full-Time
                        </button>
                        <button
                            type="button"
                            className={`${roleType === "wordingStudent" ? "bg-green-500" : "bg-gray-500"
                                } text-white px-4 py-2 rounded-full font-bold transition`}
                            onClick={() => handleRoleChange("wordingStudent")}
                        >
                            Part-Time
                        </button>
                    </div>
                </div>

                {message && <p className="text-sm text-center mb-5">{message}</p>}

                <button
                    type="submit"
                    className="mt-10 w-full rounded-full border bg-foreground text-background py-3 text-center text-sm sm:text-base font-bold hover:bg-gray-600 transition"
                >
                    Match
                </button>
            </form>
        </main>
    );
}
