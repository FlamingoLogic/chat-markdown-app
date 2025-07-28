import React from 'react';
import './CategoryTiles.css';

const CategoryTiles = ({ 
  categories, 
  documents, 
  onCategorySelect, 
  isManagerMode 
}) => {
  
  const getDocumentCount = (categoryId) => {
    const categoryDocs = documents.filter(doc => doc.categoryId === categoryId);
    return isManagerMode 
      ? categoryDocs.length 
      : categoryDocs.filter(doc => doc.status === 'published').length;
  };

  return (
    <div className="category-tiles">
      <div className="tiles-header">
        <h2>Knowledge Categories</h2>
        <p>Explore our organized information centers</p>
      </div>
      
      <div className="tiles-grid">
        {categories.map(category => {
          const docCount = getDocumentCount(category.id);
          
          return (
            <div
              key={category.id}
              className="category-tile"
              onClick={() => onCategorySelect(category.id)}
              style={{ '--category-color': category.color }}
            >
              <div className="tile-header">
                <div className="tile-icon">{category.icon}</div>
                <div className="tile-badge-container">
                  <div className="tile-badge">
                    {docCount} document{docCount !== 1 ? 's' : ''}
                  </div>
                  {category.isSystemCategory && (
                    <div className="system-badge" title="System Protected - Cannot be modified">
                      🔒
                    </div>
                  )}
                </div>
              </div>
              
              <div className="tile-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              
              <div className="tile-footer">
                <span className="explore-text">Click to explore →</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="tiles-footer">
        <div className="quick-stats">
          <div className="stat">
            <span className="stat-number">
              {categories.reduce((total, cat) => total + getDocumentCount(cat.id), 0)}
            </span>
            <span className="stat-label">Total Documents</span>
          </div>
          <div className="stat">
            <span className="stat-number">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTiles; 