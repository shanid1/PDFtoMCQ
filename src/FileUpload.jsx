import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./Main.css";

export default function FileUpload() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${baseUrl}/upload_pdf/`, {
     method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMcqs(data.mcqs || []);
      setUploaded(true);
    } catch (err) {
      console.error("Error uploading:", err);
    }
    setLoading(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-6">
      {!uploaded ? (
        <>
          <h2 className="text-xl font-bold mb-4">Upload Notes → Generate MCQs</h2>
          <div
            {...getRootProps()}
            className="dropZone border-2 border-dashed p-6 rounded-xl text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p><span>Drop your notes here…</span></p>
            ) : (
              <p>Drag & drop notes, or click to upload (PDF/TXT)</p>
            )}
          </div>
          {loading && <p className="mt-4">⏳ Generating MCQs...</p>}
        </>
      ) : (
        <div className="quiz">
          <h2 className="text-xl font-bold mb-4">Generated Quiz</h2>
          {mcqs.length === 0 ? (
            <p>No questions generated. Try another PDF.</p>
          ) : (
            <div className="space-y-4">
              {mcqs.map((q, i) => (
                <div key={i} className="border p-4 rounded">
                  <p className="font-semibold">{q.question}</p>
                  <ul className="list-disc ml-6">
                    {q.options.map((opt, j) => (
                      <li key={j}>{opt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              setUploaded(false);
              setMcqs([]);
            }}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload Another PDF
          </button>
        </div>
      )}
    </div>
  );
}
