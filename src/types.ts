export interface FileItem {
    id: string;
    title: string;
    subject?: string;
    tags?: string[];
    size?: number;
    mime_type?: string;
    original_filename?: string;
    download_url?: string;
    created_at?: string;
    file_hash?: string;
}

export interface SearchResult extends FileItem {
    score?: number;
    preview?: string;
    matched_in?: string;
}

export type ProcessStatus = "not_generated" | "queued" | "processing" | "ready" | "failed";

export interface SummaryResponse {
    status: ProcessStatus;
    summary?: string;
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface FlashcardsResponse {
    status: ProcessStatus;
    flashcards?: Flashcard[];
}

export interface AskResponse {
    status: ProcessStatus | "not_found";
    answer?: string;
}

export interface UploadPayload {
    file: File;
    title?: string;
    subject?: string;
    tags?: string;
    force?: boolean;
}
