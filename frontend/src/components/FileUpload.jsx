import React, { useState, useEffect } from "react";
import "./FileUpload.css";

const FileUpload = ({ setFileImage, reset }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  // Reset the file and preview when the reset prop changes
  useEffect(() => {
    if (reset) {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      setFile(null);
      setFileImage(null);
    }
  }, [reset, setFileImage]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      setFile({
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
      setFileImage(selectedFile);
    }
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
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      setFile({
        file: droppedFile,
        preview: URL.createObjectURL(droppedFile),
      });
      setFileImage(droppedFile);
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
        <input type="file" required onChange={handleFileChange} hidden accept="image/*" />
        {file?.preview ? (
          <img src={file.preview} alt="Preview" className="preview-image" />
        ) : (
          <p>
            Drop your images here or <span>click to browse</span>
          </p>
        )}
      </label>
    </div>
  );
};

export default FileUpload;