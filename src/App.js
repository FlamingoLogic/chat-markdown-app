import React, { useState } from 'react';
import DocumentUpload from './components/DocumentUpload';
import MarkdownViewer from './components/MarkdownViewer';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Simple password check (in production, this would be more secure)
  const SITE_PASSWORD = 'demo123'; // Change this to your desired password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setIsManagerMode(false);
  };

  const handleDocumentUpload = (document) => {
    setDocuments(prev => [...prev, document]);
    setShowUpload(false);
    alert('Document uploaded successfully!');
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
  };

  const handlePublishDocument = (documentId) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, status: 'published' }
          : doc
      )
    );
  };

  const handleUnpublishDocument = (documentId) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, status: 'draft' }
          : doc
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-container">
            {/* Placeholder for logo */}
            <h1>Chat Markdown App</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter site password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" className="login-button">
              Access Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h2>Chat Markdown App</h2>
        </div>
        <div className="nav-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="search-input"
          />
        </div>
        <div className="nav-right">
          <button
            onClick={() => setIsManagerMode(!isManagerMode)}
            className={`mode-toggle ${isManagerMode ? 'active' : ''}`}
          >
            {isManagerMode ? 'User Mode' : 'Manager Mode'}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-header">
            <h3>Chat</h3>
          </div>
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <p>Start a conversation by asking about documents...</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              className="message-input"
            />
            <button className="send-button">Send</button>
          </div>
        </div>

        {/* Document Viewer Section */}
        <div className="document-section">
          <div className="document-header">
            <h3>Documents</h3>
            {isManagerMode && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="upload-toggle-button"
              >
                {showUpload ? 'Hide Upload' : 'Upload Document'}
              </button>
            )}
          </div>
          
          {showUpload && isManagerMode ? (
            <DocumentUpload onDocumentUpload={handleDocumentUpload} />
          ) : (
            <div className="document-viewer">
              {selectedDocument ? (
                <MarkdownViewer 
                  document={selectedDocument} 
                  onBack={handleBackToDocuments}
                />
              ) : (
                <div className="no-document">
                  <p>Select a document to view</p>
                  <div className="document-list">
                    {documents.length === 0 ? (
                      <p>No documents uploaded yet</p>
                    ) : (
                      <div className="documents-grid">
                        {documents.map(doc => (
                          <div key={doc.id} className="document-item">
                            <div className="document-info">
                              <h4 onClick={() => handleDocumentSelect(doc)}>
                                {doc.title}
                              </h4>
                              <div className="document-meta">
                                <span className={`status ${doc.status}`}>
                                  {doc.status}
                                </span>
                                <span className="upload-date">
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {isManagerMode && (
                              <div className="document-actions">
                                {doc.status === 'draft' ? (
                                  <button
                                    onClick={() => handlePublishDocument(doc.id)}
                                    className="publish-button"
                                  >
                                    Publish
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUnpublishDocument(doc.id)}
                                    className="unpublish-button"
                                  >
                                    Unpublish
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
