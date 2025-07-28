import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import MarkdownViewer from './components/MarkdownViewer';
import FolderManager from './components/FolderManager';
import CategoryTiles from './components/CategoryTiles';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Updated data structure to support categories
  const [categories] = useState([
    {
      id: 'hubs',
      name: 'Hubs',
      icon: '📍',
      description: 'Central information centers',
      color: '#3b82f6'
    },
    {
      id: 'tools', 
      name: 'Tools',
      icon: '🔧',
      description: 'Operational resources',
      color: '#10b981'
    },
    {
      id: 'tasks',
      name: 'Tasks', 
      icon: '✅',
      description: 'Action items and workflows',
      color: '#f59e0b'
    },
    {
      id: 'roles',
      name: 'Roles',
      icon: '👥', 
      description: 'People and responsibilities',
      color: '#8b5cf6'
    }
  ]);

  const [folders, setFolders] = useState([
    {
      id: 'root',
      name: 'Root',
      parentId: null,
      categoryId: null,
      createdAt: new Date().toISOString(),
      isRoot: true
    },
    // Category-based folders
    {
      id: 'hubs-main',
      name: 'Main Hub',
      parentId: 'hubs',
      categoryId: 'hubs',
      createdAt: new Date().toISOString(),
      isRoot: false
    },
    {
      id: 'tools-analysis',
      name: 'Analysis Tools',
      parentId: 'tools',
      categoryId: 'tools', 
      createdAt: new Date().toISOString(),
      isRoot: false
    },
    {
      id: 'tasks-weekly',
      name: 'Weekly Tasks',
      parentId: 'tasks',
      categoryId: 'tasks',
      createdAt: new Date().toISOString(),
      isRoot: false
    },
    {
      id: 'roles-management',
      name: 'Management Roles',
      parentId: 'roles',
      categoryId: 'roles',
      createdAt: new Date().toISOString(),
      isRoot: false
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Hub Overview',
      content: `# Hub Overview

Welcome to the central information hub! This is where all critical information is centralized for easy access.

## What are Hubs?

Hubs serve as central information centers that bring together related resources, documents, and knowledge areas.

## Key Features

- **Centralized Information**: All related documents in one place
- **Easy Navigation**: Quick access to frequently used resources  
- **Knowledge Sharing**: Collaborative information management
- **Search & Discovery**: Find what you need quickly

## Getting Started

1. Browse available hubs using the tile interface
2. Click on any hub to explore its contents
3. Use the search function to find specific information
4. Add new documents to relevant hubs as a manager

This system helps organize information in a logical, accessible way that supports both individual work and team collaboration.`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'hubs-main',
      categoryId: 'hubs'
    },
    {
      id: 2,
      title: 'Analysis Toolkit',
      content: `# Analysis Toolkit

A comprehensive set of tools for data analysis, reporting, and decision making.

## Available Tools

### Data Analysis
- Statistical analysis templates
- Data visualization guides  
- Reporting frameworks
- Performance metrics

### Process Tools
- Workflow templates
- Process mapping guides
- Efficiency analysis
- Quality assurance checklists

### Decision Support
- Decision matrices
- Risk assessment tools
- Cost-benefit analysis
- Strategic planning templates

## How to Use

1. Select the appropriate tool for your task
2. Follow the step-by-step guidance
3. Customize templates to your needs
4. Document results for future reference

These tools are designed to support evidence-based decision making and improve operational efficiency.`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'tools-analysis',
      categoryId: 'tools'
    },
    {
      id: 3,
      title: 'Weekly Task Planning',
      content: `# Weekly Task Planning

Systematic approach to planning and managing weekly tasks for optimal productivity.

## Planning Process

### Monday Planning
- Review previous week outcomes
- Set priorities for current week
- Allocate time blocks for major tasks
- Identify potential roadblocks

### Daily Reviews
- **Tuesday**: Progress check and adjustments
- **Wednesday**: Mid-week evaluation
- **Thursday**: Preparation for week completion
- **Friday**: Week wrap-up and next week preview

## Task Categories

### High Priority
- Critical deadlines
- Client deliverables
- Team dependencies
- Strategic initiatives

### Medium Priority  
- Routine operations
- Process improvements
- Documentation updates
- Training activities

### Low Priority
- Administrative tasks
- Optional improvements
- Research and development
- Nice-to-have features

## Success Metrics

- Task completion rates
- Quality of deliverables
- Time management efficiency
- Stakeholder satisfaction

Regular weekly planning helps maintain focus, improve productivity, and ensure important tasks receive appropriate attention.`,
      status: 'published',
      uploadedAt: new Date().toISOString(), 
      folderId: 'tasks-weekly',
      categoryId: 'tasks'
    },
    {
      id: 4,
      title: 'Management Role Guide',
      content: `# Management Role Guide

Comprehensive guide to management responsibilities, expectations, and best practices.

## Core Responsibilities

### Team Leadership
- Setting clear expectations and goals
- Providing regular feedback and coaching
- Supporting professional development
- Facilitating team collaboration

### Strategic Planning
- Long-term vision development
- Resource allocation decisions
- Risk management and mitigation
- Performance monitoring and optimization

### Stakeholder Management
- Client relationship management
- Internal communication coordination
- Vendor and partner relationships
- Board and executive reporting

## Key Skills

### Communication
- Active listening
- Clear and concise messaging
- Conflict resolution
- Presentation and facilitation

### Decision Making
- Data-driven analysis
- Stakeholder consideration
- Risk assessment
- Implementation planning

### Leadership
- Vision casting
- Team motivation
- Change management
- Cultural development

## Performance Metrics

- Team productivity and satisfaction
- Goal achievement rates
- Stakeholder feedback scores
- Financial performance indicators

Effective management requires balancing multiple responsibilities while maintaining focus on both people and results.`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'roles-management', 
      categoryId: 'roles'
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
    const dataVersion = localStorage.getItem('dataVersion');
    
    // Clear old data if it doesn't have category support
    if (dataVersion !== '2.0') {
      localStorage.removeItem('documents');
      localStorage.removeItem('folders');
      localStorage.setItem('dataVersion', '2.0');
      // Use default data with categories
      return;
    }
    
    if (savedDocuments) {
      const parsedDocs = JSON.parse(savedDocuments);
      // Ensure all documents have categoryId
      const updatedDocs = parsedDocs.map(doc => ({
        ...doc,
        categoryId: doc.categoryId || (doc.folderId?.includes('hubs') ? 'hubs' : 
                   doc.folderId?.includes('tools') ? 'tools' :
                   doc.folderId?.includes('tasks') ? 'tasks' :
                   doc.folderId?.includes('roles') ? 'roles' : null)
      }));
      setDocuments(updatedDocs);
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
      parentId: parentId === 'root' ? 'root' : parentId,
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

  // Get documents in current folder/category
  const getCurrentDocuments = () => {
    if (currentCategory) {
      return documents.filter(doc => doc.categoryId === currentCategory);
    }
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

  // Category navigation
  const handleCategorySelect = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentFolder(categoryId);
    setSelectedDocument(null);
  };

  const handleBackToCategories = () => {
    setCurrentCategory(null);
    setCurrentFolder('root');
    setSelectedDocument(null);
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
          {!currentCategory ? (
            <CategoryTiles 
              categories={categories}
              documents={documents}
              onCategorySelect={handleCategorySelect}
              isManagerMode={isManagerMode}
            />
          ) : (
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
              onBackToCategories={handleBackToCategories}
              currentCategory={currentCategory}
              categories={categories}
            />
          )}
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
