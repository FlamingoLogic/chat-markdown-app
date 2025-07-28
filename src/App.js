import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import MarkdownViewer from './components/MarkdownViewer';
import FolderManager from './components/FolderManager';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Updated data structure to support folders
  const [folders, setFolders] = useState([
    {
      id: 'root',
      name: 'Root',
      parentId: null,
      createdAt: new Date().toISOString(),
      isRoot: true
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      parentId: 'root',
      createdAt: new Date().toISOString(),
      isRoot: false
    },
    {
      id: 'technical-docs',
      name: 'Technical Documentation',
      parentId: 'root',
      createdAt: new Date().toISOString(),
      isRoot: false
    },
    {
      id: 'project-planning',
      name: 'Project Planning',
      parentId: 'root',
      createdAt: new Date().toISOString(),
      isRoot: false
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Getting Started Guide',
      content: `# Getting Started Guide

Welcome to the Chat-Referenced Markdown Document App! This application allows you to upload, organize, and view markdown documents with a beautiful, Obsidian-inspired interface.

## Features

- **Document Upload**: Drag and drop markdown files or use the upload button
- **Manager Mode**: Upload and manage documents (password: demo123)
- **User Mode**: View published documents in a clean, readable format
- **Folder Organization**: Organize documents into folders for better navigation
- **Syntax Highlighting**: Code blocks are beautifully highlighted
- **Responsive Design**: Works great on desktop and mobile devices

## How to Use

### For Managers
1. Enter the password to access manager mode
2. Create folders to organize your documents
3. Upload markdown files using drag-and-drop
4. Assign documents to folders
5. Publish documents to make them visible to users

### For Users
1. Browse the folder structure to find documents
2. Click on any document to view its content
3. Use the back button to return to the document list
4. Enjoy the clean, readable formatting

## Getting Help

If you need assistance, check the Technical Documentation folder for more detailed information about the app's features and capabilities.`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'getting-started'
    },
    {
      id: 2,
      title: 'Technical Documentation',
      content: `# Technical Documentation

## Architecture Overview

This application is built with modern web technologies:

- **Frontend**: React with Create React App
- **Styling**: Custom CSS with dark theme
- **Markdown Rendering**: react-markdown with rehype-highlight
- **Deployment**: AWS Amplify with automatic CI/CD

## API Endpoints

### Document Management
\`\`\`javascript
// Upload document
POST /api/documents
{
  "title": "Document Title",
  "content": "Markdown content",
  "folderId": "folder-id"
}

// Get documents
GET /api/documents?folderId=folder-id

// Update document
PUT /api/documents/:id
{
  "title": "Updated Title",
  "status": "published",
  "folderId": "new-folder-id"
}
\`\`\`

### Folder Management
\`\`\`javascript
// Create folder
POST /api/folders
{
  "name": "Folder Name",
  "parentId": "parent-folder-id"
}

// Get folder tree
GET /api/folders

// Move folder
PUT /api/folders/:id
{
  "parentId": "new-parent-id"
}
\`\`\`

## Data Model

### Document Structure
\`\`\`json
{
  "id": "unique-id",
  "title": "Document Title",
  "content": "Markdown content",
  "status": "published|draft|archived",
  "uploadedAt": "2024-01-01T00:00:00Z",
  "folderId": "folder-id"
}
\`\`\`

### Folder Structure
\`\`\`json
{
  "id": "unique-id",
  "name": "Folder Name",
  "parentId": "parent-folder-id",
  "createdAt": "2024-01-01T00:00:00Z",
  "isRoot": false
}
\`\`\`

## Development Setup

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start development server: \`npm start\`
4. Build for production: \`npm run build\`

## Deployment

The app is automatically deployed to AWS Amplify when changes are pushed to the main branch of the GitHub repository.`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'technical-docs'
    },
    {
      id: 3,
      title: 'Project Roadmap',
      content: `# Project Roadmap

## Phase 1: Core Features ✅
- [x] Document upload and management
- [x] Markdown rendering with syntax highlighting
- [x] Manager/User mode toggle
- [x] Document status management
- [x] Responsive design
- [x] Navigation improvements

## Phase 2: Organization Features 🚧
- [x] Folder structure implementation
- [ ] Drag and drop file organization
- [ ] Breadcrumb navigation
- [ ] Search functionality
- [ ] Document tagging system

## Phase 3: Advanced Features 📋
- [ ] Real-time chat integration
- [ ] Document collaboration
- [ ] Version control
- [ ] User management system
- [ ] Advanced search with filters

## Phase 4: Enterprise Features 🔮
- [ ] API authentication
- [ ] Role-based permissions
- [ ] Audit logging
- [ ] Backup and restore
- [ ] Analytics dashboard

## Timeline

| Phase | Duration | Status |
|-------|----------|---------|
| Phase 1 | 2 weeks | ✅ Complete |
| Phase 2 | 1 week | 🚧 In Progress |
| Phase 3 | 2 weeks | 📋 Planned |
| Phase 4 | 3 weeks | 🔮 Future |

## Next Steps

1. Complete folder management system
2. Implement drag-and-drop organization
3. Add search functionality
4. Begin chat integration planning

## Notes

- Prioritize user experience and intuitive navigation
- Maintain clean, readable code structure
- Ensure mobile responsiveness throughout
- Consider accessibility requirements`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'project-planning'
    }
  ]);

  const [isManagerMode, setIsManagerMode] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Simple password check (in production, this would be more secure)
  const SITE_PASSWORD = 'demo123';

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('documents');
    const savedFolders = localStorage.getItem('folders');
    
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  // Folder management functions
  const handleCreateFolder = (name, parentId = currentFolder) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      createdAt: new Date().toISOString(),
      isRoot: false
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId) => {
    // Move documents from deleted folder to parent
    const folderToDelete = folders.find(f => f.id === folderId);
    if (folderToDelete) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.folderId === folderId 
            ? { ...doc, folderId: folderToDelete.parentId || 'root' }
            : doc
        )
      );
    }
    
    // Remove folder and its children
    const getFolderChildren = (parentId) => {
      return folders.filter(f => f.parentId === parentId);
    };
    
    const foldersToDelete = [folderId];
    const processChildren = (parentId) => {
      const children = getFolderChildren(parentId);
      children.forEach(child => {
        foldersToDelete.push(child.id);
        processChildren(child.id);
      });
    };
    
    processChildren(folderId);
    setFolders(prev => prev.filter(f => !foldersToDelete.includes(f.id)));
  };

  const handleMoveDocument = (documentId, newFolderId) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, folderId: newFolderId }
          : doc
      )
    );
  };

  // Get current folder info
  const getCurrentFolder = () => {
    return folders.find(f => f.id === currentFolder) || folders.find(f => f.isRoot);
  };

  // Get breadcrumb path
  const getBreadcrumbPath = () => {
    const path = [];
    let current = getCurrentFolder();
    
    while (current && !current.isRoot) {
      path.unshift(current);
      current = folders.find(f => f.id === current.parentId);
    }
    
    return path;
  };

  // Get folders in current directory
  const getCurrentFolders = () => {
    return folders.filter(f => f.parentId === currentFolder);
  };

  // Get documents in current folder
  const getCurrentDocuments = () => {
    return documents.filter(doc => doc.folderId === currentFolder);
  };

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
    setCurrentFolder('root');
    setSelectedDocument(null);
  };

  const handleDocumentUpload = (document) => {
    const newDocument = {
      ...document,
      folderId: currentFolder
    };
    setDocuments(prev => [...prev, newDocument]);
    setShowUpload(false);
    alert('Document uploaded successfully!');
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
  };

  const handleFolderSelect = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedDocument(null);
  };

  const handleBreadcrumbClick = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedDocument(null);
  };

  const handleUpdateDocument = (documentId, updates) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, ...updates }
          : doc
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: isManagerMode ? 'Manager' : 'User',
        text: currentMessage.trim(),
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-container">
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
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              className="message-input"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>

        {/* Document List Section */}
        <div className="document-list-section">
          <DocumentList 
            documents={documents}
            currentDocuments={getCurrentDocuments()}
            folders={getCurrentFolders()}
            currentFolder={getCurrentFolder()}
            breadcrumbPath={getBreadcrumbPath()}
            onDocumentSelect={handleDocumentSelect}
            onFolderSelect={handleFolderSelect}
            onBreadcrumbClick={handleBreadcrumbClick}
            selectedDocument={selectedDocument}
            isManagerMode={isManagerMode}
            onUpdateDocument={handleUpdateDocument}
            onMoveDocument={handleMoveDocument}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            showUpload={showUpload}
            onToggleUpload={() => setShowUpload(!showUpload)}
          />
        </div>

        {/* Document Viewer Section */}
        <div className="document-viewer-section">
          {showUpload && isManagerMode ? (
            <DocumentUpload 
              onDocumentUpload={handleDocumentUpload}
              currentFolder={getCurrentFolder()}
            />
          ) : (
            <MarkdownViewer 
              document={selectedDocument} 
              onBack={handleBackToDocuments}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
