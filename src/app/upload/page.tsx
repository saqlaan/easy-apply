"use client"
import { useState } from 'react';
import Image from "next/image";

export default function Home() {
    const [skills, setSkills] = useState('');
    const [cv, setCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('cv', cv); // Append CV file
        formData.append('coverLetter', coverLetter); // Append Cover Letter file
        formData.append('skillsText', skills); // Append the skills text

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Files and skills uploaded successfully!');
            } else {
                setMessage('Error uploading files or skills.');
            }
        } catch (error) {
            setMessage('Error uploading files or skills.');
        } finally {
            setLoading(false);
            setSkills(null);
            setCoverLetter(null);
            setCv(null);
        }
    };

    return (
        <div>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#333', fontWeight: '600' }}>
                    Upload Your CV, Cover Letter, and Skills
                </h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="skills" style={{ display: 'block', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                            Skills (Enter your skills here)
                        </label>
                        <textarea
                            id="skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                height: '120px',
                                padding: '12px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                backgroundColor: '#fff',
                                color: '#555',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="cv" style={{ display: 'block', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                            Upload CV (PDF, DOCX, etc.)
                        </label>
                        <input
                            type="file"
                            id="cv"
                            onChange={(e) => setCv(e.target.files[0])}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                backgroundColor: '#fff',
                                color: '#555',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="coverLetter" style={{ display: 'block', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
                            Upload Cover Letter (PDF, DOCX, etc.)
                        </label>
                        <input
                            type="file"
                            id="coverLetter"
                            onChange={(e) => setCoverLetter(e.target.files[0])}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                backgroundColor: '#fff',
                                color: '#555',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {message && <p style={{ marginTop: '20px', fontWeight: '600', color: '#555', textAlign: 'center' }}>{message}</p>}

            </div>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-50">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="/"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Home
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
