import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DuplicateDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DuplicateDialog: React.FC<DuplicateDialogProps> = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 card-shadow animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="text-yellow-600 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-stitch-text mb-2">Duplicate Detected</h3>
                    <p className="text-stitch-subtext mb-6">
                        This file already exists in your library. Do you want to upload it anyway?
                    </p>
                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-stitch-text hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-stitch-blue text-white hover:bg-blue-600 font-medium transition-colors"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
