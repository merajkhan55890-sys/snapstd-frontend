import React from 'react';
import { FileItem, SearchResult } from '../types';
import { FileCard } from './FileCard';

interface FileListProps {
    files: (FileItem | SearchResult)[];
    onDelete: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
    if (files.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-stitch-subtext">No files found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {files.map(file => (
                <FileCard key={file.id} file={file} onDelete={onDelete} />
            ))}
        </div>
    );
};
