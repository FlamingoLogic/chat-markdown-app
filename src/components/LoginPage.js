import React, { useState } from 'react';
import { auth } from '../lib/supabase';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('user'); // 'admin' or 'user'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sitePassword, setSitePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signInAdmin(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Check if user has admin role (you can add role-based access here)
        onLogin({
          user: data.user,
          userType: 'admin',
          isManagerMode: true
        });
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signInUser(sitePassword);
      
      if (error) {
        setError(error.message);
      } else {
        onLogin({
          user: data.user,
          userType: 'user',
          isManagerMode: false
        });
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Branding */}
      <div className="login-branding">
        <div className="brand-logo">🏥</div>
        <h1 className="brand-title">NDIS Knowledge System</h1>
        <p className="brand-subtitle">
          Access comprehensive NDIS documentation, guides, and chat support for providers and participants.
        </p>
        
        <div className="brand-features">
          <h3>Available Features:</h3>
          <ul className="feature-list">
            <li>View published documents</li>
            <li>Search knowledge base</li>
            <li>AI chat assistance</li>
            <li>Browse categories</li>
            <li>Document management</li>
            <li>Real-time updates</li>
          </ul>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-card">
        <div className="login-header">
          <h2>🔑 Access Portal</h2>
          <p>Choose your access type to continue</p>
        </div>

        {/* Login Type Selector */}
        <div className="login-type-selector">
          <button
            type="button"
            className={`type-button ${loginType === 'user' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('user');
              setError('');
            }}
          >
            <div className="type-icon">👤</div>
            <div className="type-info">
              <h3>User Access</h3>
              <p>Read documents & chat</p>
            </div>
          </button>
          
          <button
            type="button"
            className={`type-button ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
          >
            <div className="type-icon">👨‍💼</div>
            <div className="type-info">
              <h3>Admin Access</h3>
              <p>Manage documents & users</p>
            </div>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* User Login Form */}
        {loginType === 'user' && (
          <form onSubmit={handleUserLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="sitePassword">Site Password</label>
              <input
                type="password"
                id="sitePassword"
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
                placeholder="Enter site access password"
                required
                disabled={isLoading}
              />
              <small className="hint">Contact your administrator for the site password</small>
            </div>
            
            <button 
              type="submit" 
              className="login-button user-login"
              disabled={isLoading || !sitePassword}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span className="button-icon">🚀</span>
                  Access Site
                </>
              )}
            </button>
          </form>
        )}

        {/* Admin Login Form */}
        {loginType === 'admin' && (
          <form onSubmit={handleAdminLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button admin-login"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="button-icon">🔐</span>
                  Admin Login
                </>
              )}
            </button>
          </form>
        )}

        <div className="login-footer">
          <div className="system-info">
            <h4>🏥 NDIS Knowledge System</h4>
            <p>
              {loginType === 'user' 
                ? 'Access comprehensive NDIS documentation, guides, and chat support.'
                : 'Manage documents, upload content, and oversee system operations.'
              }
            </p>
          </div>
          
          <div className="access-features">
            <h5>Available Features:</h5>
            <ul>
              {loginType === 'user' ? (
                <>
                  <li>📖 View published documents</li>
                  <li>🔍 Search knowledge base</li>
                  <li>💬 AI chat assistance</li>
                  <li>📁 Browse categories</li>
                </>
              ) : (
                <>
                  <li>📝 Create & edit documents</li>
                  <li>📄 Upload PDF files</li>
                  <li>🤖 AI PDF processing</li>
                  <li>👥 User management</li>
                  <li>📊 Analytics dashboard</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 