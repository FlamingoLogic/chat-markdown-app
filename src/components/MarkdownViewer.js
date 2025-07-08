import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './MarkdownViewer.css';

const MarkdownViewer = ({ document }) => {
  if (!document) {
    return (
      <div className="markdown-viewer">
        <div className="no-document">
          <h3>No Document Selected</h3>
          <p>Select a document from the list to view its content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-viewer">
      <div className="document-header">
        <h2>{document.title}</h2>
        <div className="document-meta">
          <span className={`status ${document.status}`}>
            {document.status.toUpperCase()}
          </span>
          <span className="upload-date">
            {new Date(document.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="markdown-content">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom components for better styling
            h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
            h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
            h5: ({ children }) => <h5 className="md-h5">{children}</h5>,
            h6: ({ children }) => <h6 className="md-h6">{children}</h6>,
            p: ({ children }) => <p className="md-p">{children}</p>,
            ul: ({ children }) => <ul className="md-ul">{children}</ul>,
            ol: ({ children }) => <ol className="md-ol">{children}</ol>,
            li: ({ children }) => <li className="md-li">{children}</li>,
            blockquote: ({ children }) => <blockquote className="md-blockquote">{children}</blockquote>,
            code: ({ inline, className, children }) => {
              return inline ? (
                <code className="md-code-inline">{children}</code>
              ) : (
                <code className={`md-code-block ${className}`}>{children}</code>
              );
            },
            pre: ({ children }) => <pre className="md-pre">{children}</pre>,
            a: ({ href, children }) => (
              <a href={href} className="md-link" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            table: ({ children }) => <table className="md-table">{children}</table>,
            thead: ({ children }) => <thead className="md-thead">{children}</thead>,
            tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
            tr: ({ children }) => <tr className="md-tr">{children}</tr>,
            th: ({ children }) => <th className="md-th">{children}</th>,
            td: ({ children }) => <td className="md-td">{children}</td>,
          }}
        >
          {document.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer; 