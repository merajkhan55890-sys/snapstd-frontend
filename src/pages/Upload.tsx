import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, FileText, CheckCircle } from 'lucide-react';
import { DuplicateDialog } from '../components/DuplicateDialog';

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [tags, setTags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Default title without extension
        }
    };

    const handleUpload = async (force: boolean = false) => {
        if (!file) return;

        setIsUploading(true);
        try {
            await api.uploadFile({
                file,
                title,
                subject,
                tags,
                force
            });
            // Success
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                setShowDuplicateDialog(true);
            } else {
                alert('Upload failed: ' + (err.response?.data?.detail || err.message));
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
            <header className="flex items-center mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-stitch-subtext">
                    <X className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-stitch-text ml-2">Upload Document</h1>
            </header>

            <div className="flex-1 space-y-6">
                {/* File Picker */}
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <>
                            <div className="bg-green-100 p-4 rounded-full mb-3">
                                <FileText className="text-green-600 w-8 h-8" />
                            </div>
                            <p className="font-medium text-stitch-text break-all px-4">{file.name}</p>
                            <p className="text-sm text-stitch-subtext mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button onClick={(e) => {
                                e.preventDefault();
                                setFile(null);
                            }} className="mt-4 text-sm text-red-500 hover:underline z-10 relative">Remove</button>
                        </>
                    ) : (
                        <>
                            <div className="bg-blue-50 p-4 rounded-full mb-3">
                                <UploadIcon className="text-stitch-blue w-8 h-8" />
                            </div>
                            <p className="font-medium text-stitch-text">Tap to select a file</p>
                            <p className="text-sm text-stitch-subtext mt-1">PDF, DOCX, TXT supported</p>
                        </>
                    )}
                </div>

                {/* Metadata Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stitch-subtext mb-1 ml-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-stitch-blue outline-none transition-shadow card-shadow placeholder-gray-300"
                            placeholder="Document Title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stitch-subtext mb-1 ml-1">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-stitch-blue outline-none transition-shadow card-shadow placeholder-gray-300"
                            placeholder="e.g. Biology, History"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stitch-subtext mb-1 ml-1">Tags</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-stitch-blue outline-none transition-shadow card-shadow placeholder-gray-300"
                            placeholder="comma, separated, tags"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 pb-6">
                <button
                    onClick={() => handleUpload(false)}
                    disabled={!file || isUploading}
                    className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center transition-all ${!file || isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-stitch-blue text-white hover:bg-blue-600 hover:scale-[1.02]'
                        }`}
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Uploading...
                        </>
                    ) : (
                        'Upload Document'
                    )}
                </button>
            </div>

            <DuplicateDialog
                isOpen={showDuplicateDialog}
                onCancel={() => {
                    setShowDuplicateDialog(false);
                    setIsUploading(false);
                }}
                onConfirm={() => {
                    setShowDuplicateDialog(false);
                    handleUpload(true);
                }}
            />
        </div>
    );
};

export default Upload;
