import React, { useState } from "react";
import "./FileUpload.css"


const FileUpload = ({setFileImage}) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile({
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile), // Create preview URL
      });
    }
    setFileImage(selectedFile)

  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const fileData = setFile({
        file: droppedFile,
        preview: URL.createObjectURL(droppedFile), // Create preview URL
      });
      setFile(fileData)
      setFileImage(fileData)
    }
  };

  return (
    <div className="upload-container">
      <label
        className={`drop-area ${dragActive ? "drag-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" onChange={handleFileChange} hidden />
        {file?.preview ? (
          <img
            src={file.preview}
            alt="Preview"
          />
        ) : (
          <p>Drop your images here or <span>click to click to browse</span></p>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
