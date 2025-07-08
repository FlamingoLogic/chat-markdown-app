import React, { useState } from 'react';
import './DocumentUpload.css';

const DocumentUpload = ({ onDocumentUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    // Check if it's a markdown file
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      alert('Please select a markdown file (.md or .markdown)');
      return;
    }

    setUploading(true);
    
    try {
      const text = await file.text();
      const document = {
        id: Date.now().toString(),
        title: file.name.replace(/\.(md|markdown)$/, ''),
        content: text,
        status: 'draft',
        uploadedAt: new Date().toISOString(),
        size: file.size
      };
      
      onDocumentUpload(document);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          {uploading ? (
            <div className="uploading">
              <div className="spinner"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <h3>Upload Markdown Document</h3>
              <p>Drag and drop your .md file here, or click to browse</p>
              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleFileInput}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-button">
                Choose File
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload; 