import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Removed Link
import { api } from '../api/client';
import { FileItem } from '../types'; // Removed SearchResult
import { SummaryPanel } from '../components/SummaryPanel';
import { FlashcardsPanel } from '../components/FlashcardsPanel';
import { QaChatPanel } from '../components/QaChatPanel';
import { ArrowLeft, MoreVertical, FileText, Layers, MessageCircle } from 'lucide-react';

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [file, setFile] = useState<FileItem | null>(null);
    //   const [loading, setLoading] = useState(true); // Removed unused variable
    const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'qa'>('summary');

    useEffect(() => {
        // We don't have a direct "get file by ID" in the client yet, 
        // but in a real app we'd fetch it. For now, fetch all and find.
        // Optimization: Add getFile(id) to client or just use list.
        const fetchFile = async () => {
            try {
                const files = await api.getFiles();
                const found = files.find(f => f.id === id);
                if (found) setFile(found);
            } catch (err) {
                console.error(err);
            }
        };
        if (id) fetchFile();
    }, [id]);

    if (!id) return <div>Invalid ID</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col bg-gray-50">
            <header className="flex items-center justify-between mb-6 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-stitch-subtext transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 mx-4 text-center">
                    <h1 className="font-semibold text-stitch-text truncate">{file?.title || 'Loading...'}</h1>
                    <p className="text-xs text-green-600 font-medium">Document Active</p>
                </div>
                <button className="p-2 -mr-2 rounded-full hover:bg-gray-200 text-stitch-subtext">
                    <MoreVertical className="w-6 h-6" />
                </button>
            </header>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-200 rounded-2xl mb-6 relative">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all z-10 ${activeTab === 'summary' ? 'bg-white text-stitch-text shadow-sm' : 'text-stitch-subtext hover:text-stitch-text'
                        }`}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Summary
                </button>
                <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all z-10 ${activeTab === 'flashcards' ? 'bg-white text-stitch-text shadow-sm' : 'text-stitch-subtext hover:text-stitch-text'
                        }`}
                >
                    <Layers className="w-4 h-4 mr-2" />
                    Flashcards
                </button>
                <button
                    onClick={() => setActiveTab('qa')}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all z-10 ${activeTab === 'qa' ? 'bg-white text-stitch-text shadow-sm' : 'text-stitch-subtext hover:text-stitch-text'
                        }`}
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Q&A
                </button>
            </div>

            <div className="flex-1">
                {activeTab === 'summary' && <SummaryPanel fileId={id!} />}
                {activeTab === 'flashcards' && <FlashcardsPanel fileId={id!} />}
                {activeTab === 'qa' && <QaChatPanel fileId={id!} />}
            </div>
        </div>
    );
};

export default DocumentDetail;
