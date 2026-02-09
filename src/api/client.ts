import axios from 'axios';
import {
    FileItem,
    SearchResult,
    UploadPayload,
    SummaryResponse,
    FlashcardsResponse,
    AskResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const client = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // Files
    getFiles: async (): Promise<FileItem[]> => {
        const response = await client.get('/files');
        return response.data;
    },

    searchFiles: async (q: string): Promise<SearchResult[]> => {
        const response = await client.get(`/search?q=${encodeURIComponent(q)}`);
        return response.data;
    },

    semanticSearch: async (q: string): Promise<SearchResult[]> => {
        const response = await client.get(`/semantic-search?q=${encodeURIComponent(q)}`);
        return response.data;
    },

    uploadFile: async (payload: UploadPayload): Promise<FileItem> => {
        const formData = new FormData();
        formData.append('file', payload.file);
        if (payload.title) formData.append('title', payload.title);
        if (payload.subject) formData.append('subject', payload.subject);
        if (payload.tags) formData.append('tags', payload.tags);
        if (payload.force) formData.append('force', 'true');

        const response = await client.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteFile: async (id: string): Promise<void> => {
        await client.delete(`/files/${id}`);
    },

    getDownloadUrl: (id: string): string => {
        return `${API_BASE}/files/${id}/download`;
    },

    // Summary
    getSummary: async (id: string): Promise<SummaryResponse> => {
        const response = await client.get(`/files/${id}/summary`);
        return response.data;
    },

    triggerSummary: async (id: string): Promise<SummaryResponse> => {
        const response = await client.post(`/files/${id}/summary`);
        return response.data;
    },

    // Flashcards
    getFlashcards: async (id: string): Promise<FlashcardsResponse> => {
        const response = await client.get(`/files/${id}/flashcards`);
        return response.data;
    },

    triggerFlashcards: async (id: string): Promise<FlashcardsResponse> => {
        const response = await client.post(`/files/${id}/flashcards`);
        return response.data;
    },

    // Q&A
    askQuestion: async (id: string, question: string): Promise<AskResponse> => {
        const response = await client.post(`/files/${id}/ask`, { question });
        return response.data;
    },

    getAnswer: async (id: string, question: string): Promise<AskResponse> => {
        const response = await client.get(`/files/${id}/ask?q=${encodeURIComponent(question)}`);
        return response.data;
    },
};
