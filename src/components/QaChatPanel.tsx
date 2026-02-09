import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface QaChatPanelProps {
    fileId: string;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    loading?: boolean;
}

export const QaChatPanel: React.FC<QaChatPanelProps> = ({ fileId }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: 'Ask me anything about this document!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const pollForAnswer = async (question: string, messageId: string) => {
        let attempts = 0;
        const maxAttempts = 60; // 60s (1s interval)

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await api.getAnswer(fileId, question);
                if (res.status === 'ready' && res.answer) {
                    clearInterval(interval);
                    setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: res.answer!, loading: false } : msg
                    ));
                    setLoading(false);
                } else if (res.status === 'not_found') {
                    clearInterval(interval);
                    setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: "I couldn't find the answer in the document.", loading: false } : msg
                    ));
                    setLoading(false);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: "Sorry, I timed out trying to find the answer.", loading: false } : msg
                    ));
                    setLoading(false);
                } else if (res.status === 'failed') {
                    clearInterval(interval);
                    setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: "Sorry, I encountered an error.", loading: false } : msg
                    ));
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                // Continue polling if error is transient, strictly speaking we should probably stop on 4xx/5xx but for simplicity continue
            }
        }, 1000);
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
        const aiMsgId = (Date.now() + 1).toString();
        const aiMsg: Message = { id: aiMsgId, role: 'ai', content: '', loading: true };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setInput('');
        setLoading(true);

        try {
            await api.askQuestion(fileId, text);
            pollForAnswer(text, aiMsgId);
        } catch (err) {
            console.error(err);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId ? { ...msg, content: "Failed to send question.", loading: false } : msg
            ));
            setLoading(false);
        }
    };

    const quickChips = [
        "Summarize this chapter",
        "What are the key points?",
        "Quiz me on this",
        "Define main concepts"
    ];

    return (
        <div className="flex flex-col h-[600px] bg-gray-50 rounded-2xl overflow-hidden card-shadow">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-stitch-text ml-2' : 'bg-stitch-blue mr-2'}`}>
                                {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-5 h-5" />}
                            </div>
                            <div
                                className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-stitch-text text-white rounded-br-none'
                                        : 'bg-white text-stitch-text rounded-bl-none shadow-sm'
                                    }`}
                            >
                                {msg.loading ? (
                                    <div className="flex space-x-1 items-center h-5">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex space-x-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
                    {quickChips.map(chip => (
                        <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-stitch-subtext whitespace-nowrap transition-colors flex items-center"
                        >
                            <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                            {chip}
                        </button>
                    ))}
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Ask a question..."
                        disabled={loading}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-stitch-text placeholder-gray-400"
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || loading}
                        className={`p-2 rounded-full transition-colors ${!input.trim() || loading ? 'text-gray-400' : 'text-stitch-blue hover:bg-blue-50'}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
