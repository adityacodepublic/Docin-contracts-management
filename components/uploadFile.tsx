"use client";
import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useUploadFile } from "@/hooks/use-uploadFile";
import { Badge } from "./ui/badge";

const UploadFile: React.FC = () => {
  const [response, setResponse] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadFile } = useUploadFile();

  const handleConvert = async (file?: File) => {
    if (!file) return;
    try {
      setIsLoading(true);
      await uploadFile(file);
    } catch (err) {
      setResponse(false);
    } finally {
      setResponse(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg shadow-md p-8 text-center text-opacity-80">
      <h2 className="text-2xl m-5 font-bold mb-5">Upload your documents</h2>
      <div className="mb-6">
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center h-64 w-3/4 border-2 outline-dashed bg-primary-foreground hover:bg-blue-400/20 hover:outline-blue-400 rounded-2xl cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-20 h-20 mb-3" />
              <p className="mb-2 ">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs">PDF (MAX. 10MB)</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleConvert(e.target.files?.[0])}
            />
          </label>
          <div className="flex space-x-5 mt-5 text-center items-center">
            <h6>Supported Formats:</h6>
            <Badge variant="default">PDF</Badge>
            <Badge variant="default">PPTX</Badge>
            <Badge variant="default">DOCX</Badge>
            <Badge variant="default">XLSX</Badge>
            <Badge variant="default">Images</Badge>
            <Badge variant="default">Audio</Badge>
            <Badge variant="default">HTML</Badge>
            <Badge variant="default">Text Files</Badge>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex justify-center items-center text-blue-500">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="ml-2">Converting PDF to Markdown...</span>
        </div>
      )}

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
