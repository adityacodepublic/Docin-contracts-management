"use client";
import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useUploadFile } from "@/hooks/use-uploadFile";

const UploadFile: React.FC = () => {
  const [response, setResponse] = useState<boolean | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {uploadFile} = useUploadFile();
  const handleConvert = async () => {
    if (!selectedFile) return;
    try {
      setIsLoading(true);
      uploadFile(selectedFile);
    } catch (err) {
      setResponse(false);
    } finally {
      setResponse(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">PDF Upload</h2>
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          Choose a PDF file
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">PDF (MAX. 10MB)</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-300">
              Selected file: {selectedFile.name}
            </p>
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-800"
            >
              {isLoading ? "Converting PDF to Markdown..." : "Start Conversion"}
            </button>
          </div>
        )}
      </div>

      {response && (
        <div className="mt-6">
          <div className="p-4 bg-green-900 border border-green-700 text-green-100 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>PDF has been successfully converted and saved!</span>
            </div>
          </div>
        </div>
      )}

      {response === false && (
        <div className="mt-6">
          <div className="p-4 bg-red-900 border border-red-700 text-red-100 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Error processing PDF. Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
