import React from "react";
import { FileItem, SearchResult } from "../types";
import { FileText, Download, Trash2 } from "lucide-react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

interface FileCardProps {
  file: FileItem | SearchResult;
  onDelete: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const navigate = useNavigate();

  const isSearchResult = (item: FileItem | SearchResult): item is SearchResult => {
    return "score" in item;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ✅ correct: backend expects /files/{id}/download
    const url = api.getDownloadUrl(`/files/${file.id}/download`);
    window.open(url, "_blank");
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this file?")) {
      await api.deleteFile(file.id);
      onDelete(file.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/file/${file.id}`)}
      className="bg-stitch-card rounded-2xl p-4 card-shadow hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between mb-3"
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="bg-stitch-blue/10 p-3 rounded-full flex-shrink-0">
          <FileText className="text-stitch-blue w-6 h-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-stitch-text truncate">{file.title}</h3>

          <div className="flex items-center text-xs text-stitch-subtext space-x-2 mt-1">
            <span className="truncate">{file.subject || "No Subject"}</span>
            <span>•</span>
            <span>{(file.size ? (file.size / 1024 / 1024).toFixed(2) : "0")} MB</span>

            {isSearchResult(file) && file.score && (
              <>
                <span>•</span>
                <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-md">
                  {Math.round(file.score * 100)}% match
                </span>
              </>
            )}
          </div>

          {file.tags && file.tags.length > 0 && (
            <div className="flex mt-2 space-x-1 overflow-auto no-scrollbar">
              {file.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 ml-2">
        <button
          onClick={handleDownload}
          className="p-2 text-stitch-subtext hover:text-stitch-blue hover:bg-gray-100 rounded-full transition-colors"
          title="Download"
        >
          <Download size={18} />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 text-stitch-subtext hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};