import { useState } from 'react';
import Image from "next/image";

export default function Upload() {
    const [skills, setSkills] = useState('');
    const [cv, setCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isFullTime, setIsFullTime] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('cv', cv); // Append CV file
        formData.append('coverLetter', coverLetter); // Append Cover Letter file
        formData.append('skillsText', skills); // Append the skills text
        formData.append('jobType', isFullTime ? "full-time" : "working-student")

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
            setSkills("");
            setCoverLetter(null);
            setCv(null);
        }
    };

    const toggleSelection = () => {
        setIsFullTime((value) => !value); // Switch between full-time and part-time
    };

    return (
        <div>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px', backgroundColor: 'transparent', borderRadius: '8px' }} className='text-white border-grey border-[.5px]' >
                <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '600' }}>
                    Upload Your CV, Cover Letter, and Skills
                </h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="skills" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
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
                        <label htmlFor="cv" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
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
                        <label htmlFor="coverLetter" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
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

                    <div className='mb-5 items-center' style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
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

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            // width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: 'transparent',
                            color: '#fff',
                            // border: 'none',
                            // borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            border: '1px solid white',
                        }}
                        className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {message && <p style={{ marginTop: '20px', fontWeight: '600', color: '#555', textAlign: 'center' }}>{message}</p>}

            </div>

        </div>
    );
}
