import React, { useState } from 'react';
import './DocumentList.css';

const DocumentList = ({
  documents,
  currentDocuments,
  folders,
  currentFolder,
  breadcrumbPath,
  onDocumentSelect,
  onFolderSelect,
  onBreadcrumbClick,
  selectedDocument,
  isManagerMode,
  onUpdateDocument,
  onMoveDocument,
  onCreateFolder,
  onDeleteFolder,
  showUpload,
  onToggleUpload
}) => {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetFolderId) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'document') {
      onMoveDocument(draggedItem.item.id, targetFolderId);
    }
    setDraggedItem(null);
  };

  const handlePublishDocument = (documentId) => {
    onUpdateDocument(documentId, { status: 'published' });
  };

  const handleUnpublishDocument = (documentId) => {
    onUpdateDocument(documentId, { status: 'draft' });
  };

  const handleArchiveDocument = (documentId) => {
    onUpdateDocument(documentId, { status: 'archived' });
  };

  const visibleCurrentDocuments = isManagerMode 
    ? currentDocuments 
    : currentDocuments.filter(doc => doc.status === 'published');

  return (
    <div className="document-list">
      {/* Header */}
      <div className="document-list-header">
        <h3>Documents</h3>
        {isManagerMode && (
          <div className="header-actions">
            <button
              onClick={() => setShowCreateFolder(!showCreateFolder)}
              className="create-folder-button"
              title={`Create new folder in ${currentFolder?.name || 'Root'}`}
            >
              📁 New Folder
            </button>
            <button
              onClick={onToggleUpload}
              className="upload-toggle-button"
              title={`Upload document to ${currentFolder?.name || 'Root'}`}
            >
              {showUpload ? 'Hide Upload' : '📄 Upload Document'}
            </button>
          </div>
        )}
        {!isManagerMode && (
          <div className="mode-indicator">
            <span className="user-mode-text">👤 User Mode - Read Only</span>
          </div>
        )}
      </div>

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <button
          onClick={() => onBreadcrumbClick('root')}
          className="breadcrumb-item root"
        >
          🏠 Home
        </button>
        {breadcrumbPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <span className="breadcrumb-separator">›</span>
            <button
              onClick={() => onBreadcrumbClick(folder.id)}
              className="breadcrumb-item"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Create Folder Form */}
      {showCreateFolder && (
        <div className="create-folder-form">
          <div className="form-header">
            <h4>Create New Folder</h4>
            <p className="current-location">
              📍 Creating in: <strong>{currentFolder?.name || 'Root'}</strong>
            </p>
          </div>
          <form onSubmit={handleCreateFolder}>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="folder-name-input"
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="create-button">
                ✅ Create Folder
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
                className="cancel-button"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Folder List */}
      {folders.length > 0 && (
        <div className="folders-section">
          <h4>📁 Folders</h4>
          <div className="folders-grid">
            {folders.map(folder => {
              const folderDocuments = documents.filter(doc => doc.folderId === folder.id);
              const visibleDocuments = isManagerMode 
                ? folderDocuments 
                : folderDocuments.filter(doc => doc.status === 'published');
              
              return (
                <div
                  key={folder.id}
                  className="folder-item"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, folder.id)}
                >
                  <div
                    className="folder-content"
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <div className="folder-icon">📁</div>
                    <div className="folder-info">
                      <h5>{folder.name}</h5>
                      <span className="folder-meta">
                        {visibleDocuments.length} document{visibleDocuments.length !== 1 ? 's' : ''}
                        {!isManagerMode && folderDocuments.length !== visibleDocuments.length && 
                          ` (${folderDocuments.length - visibleDocuments.length} hidden)`
                        }
                      </span>
                    </div>
                  </div>
                  {isManagerMode && (
                    <div className="folder-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete folder "${folder.name}"? Documents will be moved to parent folder.`)) {
                            onDeleteFolder(folder.id);
                          }
                        }}
                        className="delete-folder-button"
                        title="Delete folder"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents List */}
              <div className="documents-section">
          <h4>Documents</h4>
          {visibleCurrentDocuments.length === 0 ? (
          <div className="no-documents">
            <p>No documents in this folder</p>
            {isManagerMode && (
              <p className="hint">Upload documents or create folders to organize your content</p>
            )}
          </div>
                  ) : (
            <div className="documents-grid">
              {visibleCurrentDocuments.map(doc => (
              <div
                key={doc.id}
                className={`document-item ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
                draggable={isManagerMode}
                onDragStart={(e) => handleDragStart(e, doc, 'document')}
              >
                <div className="document-content" onClick={() => onDocumentSelect(doc)}>
                  <div className="document-icon">📄</div>
                  <div className="document-info">
                    <h5>{doc.title}</h5>
                    <div className="document-meta">
                      <span className={`status ${doc.status}`}>
                        {doc.status.toUpperCase()}
                      </span>
                      <span className="upload-date">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {isManagerMode && (
                  <div className="document-actions">
                    {doc.status === 'draft' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishDocument(doc.id);
                        }}
                        className="publish-button"
                        title="Publish document"
                      >
                        ✅
                      </button>
                    ) : doc.status === 'published' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnpublishDocument(doc.id);
                        }}
                        className="unpublish-button"
                        title="Unpublish document"
                      >
                        ⏸️
                      </button>
                    ) : null}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveDocument(doc.id);
                      }}
                      className="archive-button"
                      title="Archive document"
                    >
                      🗃️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drop Zone for Root Folder */}
      {isManagerMode && currentFolder.isRoot && (
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'root')}
        >
          <p>Drop documents here to move to root folder</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList; 