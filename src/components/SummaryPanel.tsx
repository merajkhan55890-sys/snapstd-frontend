import React, { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
import { SummaryResponse } from "../types";
import { Sparkles, RefreshCw, AlertCircle, FileText } from "lucide-react";

interface SummaryPanelProps {
  fileId: string;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ fileId }) => {
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount = useRef(0); // ✅ FIX

  const fetchStatus = async () => {
    try {
      const response = await api.getSummary(fileId);
      setSummaryData(response);
      return response;
    } catch (err) {
      console.error(err);
      setError("Failed to fetch summary status");
      return null;
    }
  };

  const startPolling = () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    pollCount.current = 0;

    pollInterval.current = setInterval(async () => {
      pollCount.current += 1;
      const data = await fetchStatus();

      if (data?.status === "ready" || data?.status === "failed") {
        if (pollInterval.current) clearInterval(pollInterval.current);
        setLoading(false);
      } else if (pollCount.current > 45) {
        if (pollInterval.current) clearInterval(pollInterval.current);
        setLoading(false);
        setError("Summary generation timed out. Please try again.");
      }
    }, 2000);
  };

  useEffect(() => {
    fetchStatus();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fileId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.triggerSummary(fileId);
      const data = await fetchStatus();
      if (data?.status !== "ready") startPolling();
      else setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to trigger summary generation");
      setLoading(false);
    }
  };

  if (!summaryData) {
    return <div className="p-8 text-center text-stitch-subtext">Loading summary status...</div>;
  }

  if (loading || summaryData.status === "queued" || summaryData.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow">
        <div className="w-12 h-12 border-4 border-stitch-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stitch-text font-medium">Generating summary...</p>
        <p className="text-sm text-stitch-subtext mt-1">This may take a moment</p>
      </div>
    );
  }

  if (summaryData.status === "not_generated") {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow text-center">
        <div className="bg-purple-100 p-4 rounded-full mb-4">
          <Sparkles className="text-purple-600 w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-stitch-text mb-2">AI Summary</h3>
        <p className="text-stitch-subtext mb-6 max-w-sm">
          Generate an AI-powered summary of this document to quickly understand its contents.
        </p>
        <button
          onClick={handleGenerate}
          className="bg-stitch-text text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors flex items-center shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Summary
        </button>
      </div>
    );
  }

  if (summaryData.status === "ready" && summaryData.summary) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <FileText className="text-green-700 w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-stitch-text">Document Summary</h3>
        </div>

        <div className="prose prose-sm max-w-none text-stitch-text leading-relaxed">
          {summaryData.summary.split("\n").map((para, idx) => (
            <p key={idx} className="mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle className="text-red-600 w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-stitch-text mb-2">Something went wrong</h3>
      <p className="text-stitch-subtext mb-6">{error || "Failed to generate summary"}</p>
      <button onClick={handleGenerate} className="text-stitch-blue hover:text-blue-700 font-medium flex items-center">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};