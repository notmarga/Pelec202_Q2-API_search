import React, { useState } from "react";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return alert("Please choose a file first.");
    
    alert(`File "${selectedFile.name}" uploaded successfully!`);
  };

  return (
    <div className="uploadfile-container">
      <div className="inner-container">
        <input type="file" onChange={handleFileChange} className="choosefile-box" />
        <button onClick={handleUpload} className="upload-box">
          Upload File
        </button>
      </div>
    </div>
  );
}