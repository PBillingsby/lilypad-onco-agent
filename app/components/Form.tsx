"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Form() {
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !query) return;

    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("query", query);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Upload error:", err);
      setResult("Error contacting backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[95vh] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-3xl"
      >
        <h1 className="text-2xl font-semibold text-black">AI Oncologist</h1>

        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Custom file upload button */}
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : files.length > 0
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className={`w-10 h-10 mb-3 ${
                files.length > 0 ? "text-green-500" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
        </label>

        {files.length > 0 && (
          <div className="text-sm text-black">
            <p className="font-medium mb-1">{files.length} file(s) selected:</p>
            <ul className="max-h-20 overflow-y-auto pl-5 space-y-1">
              {files.map((file, idx) => (
                <li key={idx} className="text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="text"
          placeholder="Enter your question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full text-gray-800 border border-gray-300 rounded-md p-2"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!files.length || !query || isLoading}
        >
          {isLoading ? "Processing..." : "Ask"}
        </button>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-sm text-gray-600 mt-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600 mb-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            This may take a few minutes...
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded space-y-2">
            <p className="text-green-800 font-medium">Answer:</p>
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
