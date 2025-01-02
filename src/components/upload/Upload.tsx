import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { filterString } from "../../../utils/functions/filterString";

export default function Upload() {
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [roleType, setRoleType] = useState<"fullTime" | "wordingStudent" | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 4,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleType || files.length === 0) {
            setMessage("Please select the role type or upload the CV file.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("skillsText", filterString(skills));
        formData.append("jobType", roleType);

        try {
            setLoading(true);
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Files and skills uploaded successfully!");
                setSkills("");
                setFiles([]);
            } else {
                setMessage("Error uploading files or skills.");
            }
        } catch (error) {
            setMessage("Error uploading files or skills.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (role: "fullTime" | "wordingStudent") => {
        setRoleType(role);
    };

    return (
        <div className="flex flex-col gap-8 items-center sm:items-start max-w-[600px] mx-auto p-8 bg-transparent border rounded-lg mt-10">
            <h1 className="text-center text-2xl font-semibold mb-5">
                Upload Your CV, Cover Letter, and Skills
            </h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-5">
                    <label htmlFor="skills" className="block font-semibold mb-2">
                        Skills (Enter your skills here)
                    </label>
                    <textarea
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                        className="bg-transparent w-full h-40 border border-gray-300 p-2"
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="cv" className="block font-semibold mb-2">
                        Upload CV, Cover letter (PDF, DOCX, etc.)
                    </label>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-700 p-5 text-center bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100 transition"
                    >
                        <input {...getInputProps()} />
                        <p className="font-bold text-[#333]">Drop files here</p>
                    </div>
                    <div className="mt-2">
                        {files.map((file, index) => (
                            <div key={index}>{file.name}</div>
                        ))}
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="font-semibold">Select Role Type</h3>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className={`${roleType === "fullTime" ? "bg-green-500" : "bg-gray-500"
                                } text-white px-6 py-3 rounded-full font-bold transition`}
                            onClick={() => handleRoleChange("fullTime")}
                        >
                            Full-Time
                        </button>
                        <button
                            type="button"
                            className={`${roleType === "wordingStudent" ? "bg-green-500" : "bg-gray-500"
                                } text-white px-6 py-3 rounded-full font-bold transition`}
                            onClick={() => handleRoleChange("wordingStudent")}
                        >
                            Part-Time
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-10 w-full rounded-full border bg-foreground text-background py-3 text-center text-sm sm:text-base font-bold hover:bg-gray-600 transition"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>

            {message && (
                <p className="mt-5 text-center text-lg font-medium text-gray-700">{message}</p>
            )}
        </div>
    );
}
