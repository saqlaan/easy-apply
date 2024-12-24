import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { filterString } from '../../../utils/functions/filterString';

export default function Upload() {
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [roleType, setRoleType] = useState<"fullTime" | "wordingStudent">("");

    const onDrop = useCallback(files => {
        setFiles(prevFiles => ([...prevFiles, ...files]));
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 4 })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (roleType === "" || files.length === 0) {
            alert('Please select the role type or upload the CV file.');
            return;
        }
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        })
        formData.append('skillsText', filterString(skills)); // Append the skills text
        formData.append('jobType', roleType)
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Files and skills uploaded successfully!');
                setLoading(false);
                setSkills("");
                setFiles([]);
            } else {
                setMessage('Error uploading files or skills.');
            }

        } catch (error) {
            setMessage('Error uploading files or skills.');
        } finally {

        }
    };

    return (
        <div>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px', backgroundColor: 'transparent', borderRadius: '8px' }} className='text-white border-grey border-[.5px]' >
                <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
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
                            className="bg-transparent w-[100%] h-[200px] border-gray-300 border-[1px] p-2"
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="cv" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                            Upload CV, Cover letter (PDF, DOCX, etc.)
                        </label>
                        <div
                            {...getRootProps()}
                            style={{
                                border: '2px dashed #333',  // Dashed blue border
                                padding: '20px',  // Space inside the div
                                textAlign: 'center',  // Center the text
                                backgroundColor: '#f0f8ff',  // Light blue background
                                borderRadius: '8px',  // Rounded corners
                                cursor: 'pointer',  // Pointer cursor to show interactiveness
                                fontSize: '18px',  // Larger text for visibility
                                color: '#000',  // Blue text color
                                fontWeight: 'bold',  // Bold text
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
                                transition: 'background-color 0.3s ease',  // Smooth transition effect
                            }}
                        >
                            <input {...getInputProps()} />
                            <p>Drop files here</p>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            {
                                files.map((file, index) => (
                                    <div key={index}>
                                        {file.name}
                                    </div>
                                ))
                            }
                        </div>

                    </div>
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
