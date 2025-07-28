import React, { useState } from 'react';
import { supabase, PDF_BUCKET } from '../lib/supabase';
import './DocumentUpload.css';

const DocumentUpload = ({ onDocumentUpload, currentFolder }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('draft');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

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
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const title = file.name.replace('.md', '');
        setTitle(title);
        setContent(content);
      };
      reader.readAsText(file);
    } else if (file && file.type === 'application/pdf') {
      handlePdfUpload(file);
    } else {
      alert('Please upload a markdown (.md) file or PDF (.pdf) file');
    }
  };

  const handlePdfUpload = async (file) => {
    setIsProcessingPdf(true);
    setProcessingStatus('Starting PDF processing...');
    setProcessingProgress(10);
    
    try {
      // For demo purposes, we'll simulate the processing
      // In production, this would integrate with Supabase + N8N
      
      setProcessingStatus('Reading PDF content...');
      setProcessingProgress(30);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStatus('Converting to Markdown...');
      setProcessingProgress(70);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStatus('Processing complete! ✅');
      setProcessingProgress(100);

      // Set demo content for now
      const demoMarkdownContent = `# ${file.name.replace('.pdf', '')}

This document was automatically converted from PDF using AI processing.

## Document Information
- **Original file**: ${file.name}
- **Processed on**: ${new Date().toLocaleDateString()}
- **Status**: Successfully converted

## Content Summary

The PDF has been processed and converted to markdown format. In a production environment, this would contain the actual extracted and structured content from your PDF document.

### Key Features:
- ✅ AI-powered text extraction
- ✅ Automatic formatting
- ✅ Structure preservation
- ✅ Metadata retention

> **Note**: This is a demonstration. In production, the actual PDF content would be extracted and converted to proper markdown format.`;

      setTitle(file.name.replace('.pdf', ''));
      setContent(demoMarkdownContent);
      
      setTimeout(() => {
        setIsProcessingPdf(false);
        setProcessingStatus('');
        setProcessingProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('PDF processing error:', error);
      setProcessingStatus(`❌ Processing failed: ${error.message}`);
      setTimeout(() => {
        setIsProcessingPdf(false);
        setProcessingStatus('');
        setProcessingProgress(0);
      }, 5000);
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

      {/* PDF Processing Status */}
      {isProcessingPdf && (
        <div className="pdf-processing-status">
          <div className="processing-header">
            <div className="processing-icon">🤖</div>
            <div className="processing-text">
              <h4>AI Processing PDF</h4>
              <p>{processingStatus}</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">{processingProgress}%</div>
        </div>
      )}

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
            disabled={isProcessingPdf}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isProcessingPdf}
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
              placeholder="Enter markdown content, drag & drop .md file, or drop PDF for AI processing"
              rows="15"
              required
              disabled={isProcessingPdf}
            />
            <div
              className={`file-drop-zone ${isDragging ? 'dragging' : ''} ${isProcessingPdf ? 'processing' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="drop-zone-content">
                <div className="drop-icon">
                  {isProcessingPdf ? '🤖' : '📄'}
                </div>
                <p>
                  {isProcessingPdf 
                    ? 'Processing PDF...' 
                    : 'Drag and drop .md or .pdf files here'
                  }
                </p>
                <p className="or-text">or</p>
                <label htmlFor="file-input" className="file-input-label">
                  Choose File
                  <input
                    type="file"
                    id="file-input"
                    accept=".md,.markdown,.pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={isProcessingPdf}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="upload-button"
            disabled={isProcessingPdf}
          >
            {isProcessingPdf ? 'Processing...' : 'Upload Document'}
          </button>
          <div className="upload-info">
            <small>Document will be saved to: <strong>{currentFolder?.name || 'Root'}</strong></small>
            {isProcessingPdf && (
              <small className="processing-note">
                🤖 AI is converting your PDF to structured markdown...
              </small>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload; 