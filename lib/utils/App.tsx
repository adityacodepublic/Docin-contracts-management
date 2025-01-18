import React, { useState } from "react";
import { convertMd } from "../../hooks/use-uploadFile";
import { sendToAPI, useGeminiQuery } from "./chat/useTalk";

function App() {
  const [response, setResponse] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { askQuestion, isQuerying, queryResponse } = useGeminiQuery();

  const handleConvert = async () => {
    if (!selectedFile) return;
    try {
      setIsLoading(true);
      const res = await convertMd("", selectedFile);
      setResponse(res);
      await sendToAPI(res);
    } catch (err) {
      setResponse("Error processing PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>PDF to Markdown Converter & Query System</h1>
      {/* PDF Upload Section */}
      <div style={{ marginBottom: "40px" }}>
        <h2>PDF Upload</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          {selectedFile && (
            <>
              <div>Selected file: {selectedFile.name}</div>
              <button
                onClick={handleConvert}
                disabled={isLoading}
                style={{ marginTop: "10px" }}
              >
                {isLoading
                  ? "Converting PDF to Markdown..."
                  : "Start Conversion"}
              </button>
            </>
          )}
        </div>

        {response && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#e6ffe6",
                borderRadius: "4px",
                border: "1px solid #00cc00",
              }}
            >
              ✅ PDF has been successfully converted and saved!
            </div>
          </div>
        )}
      </div>

      {/* Query Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Ask a Question</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question"
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={() => askQuestion(query)} disabled={isQuerying}>
            {isQuerying ? "Asking..." : "Ask"}
          </button>
        </div>

        {queryResponse && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              marginTop: "20px",
            }}
          >
            <strong>Response:</strong>
            <p>{queryResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
