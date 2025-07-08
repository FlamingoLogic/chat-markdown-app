import React from 'react';
import './FolderManager.css';

const FolderManager = ({ 
  folders, 
  onCreateFolder, 
  onDeleteFolder, 
  onRenameFolder 
}) => {
  return (
    <div className="folder-manager">
      <h3>Folder Manager</h3>
      <p>Advanced folder management features coming soon...</p>
    </div>
  );
};

export default FolderManager; 