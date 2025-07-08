import React, { useState } from 'react';
import './DocumentUpload.css';

const DocumentUpload = ({ onDocumentUpload, currentFolder }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('draft');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      const document = {
        id: Date.now(),
        title,
        content,
        status,
        uploadedAt: new Date().toISOString(),
        folderId: currentFolder?.id || 'root'
      };
      onDocumentUpload(document);
      setTitle('');
      setContent('');
      setStatus('draft');
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type === 'text/markdown' || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const title = file.name.replace('.md', '');
        setTitle(title);
        setContent(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a markdown (.md) file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="document-upload">
      <div className="upload-header">
        <h3>Upload Document</h3>
        <div className="current-folder">
          <span>📁 Current folder: <strong>{currentFolder?.name || 'Root'}</strong></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">Document Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <div className="content-input-container">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter markdown content or drag and drop a .md file"
              rows="15"
              required
            />
            <div
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="drop-zone-content">
                <div className="drop-icon">📄</div>
                <p>Drag and drop a .md file here</p>
                <p className="or-text">or</p>
                <label htmlFor="file-input" className="file-input-label">
                  Choose File
                  <input
                    type="file"
                    id="file-input"
                    accept=".md,.markdown"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="upload-button">
            Upload Document
          </button>
          <div className="upload-info">
            <small>Document will be saved to: <strong>{currentFolder?.name || 'Root'}</strong></small>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload; 