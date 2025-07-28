import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import MarkdownViewer from './components/MarkdownViewer';
import CategoryTiles from './components/CategoryTiles';
import LoginPage from './components/LoginPage';
import { auth } from './lib/supabase';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('user'); // 'admin' or 'user'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isManagerMode, setIsManagerMode] = useState(false);
  
  // Updated data structure to support categories
  const [categories] = useState([
    {
      id: 'ndis-key-info',
      name: 'NDIS Key Information',
      icon: '🔑',
      description: 'Essential NDIS data and core information',
      color: '#dc2626',
      isSystemCategory: true // Cannot be modified by managers
    },
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
    // NDIS Key Information - System category
    {
      id: 'ndis-overview',
      name: 'NDIS Overview',
      parentId: 'ndis-key-info',
      categoryId: 'ndis-key-info',
      createdAt: new Date().toISOString(),
      isRoot: false,
      isSystemFolder: true
    },
    {
      id: 'ndis-funding',
      name: 'Funding Categories',
      parentId: 'ndis-key-info',
      categoryId: 'ndis-key-info',
      createdAt: new Date().toISOString(),
      isRoot: false,
      isSystemFolder: true
    },
    {
      id: 'ndis-supports',
      name: 'Support Categories',
      parentId: 'ndis-key-info',
      categoryId: 'ndis-key-info',
      createdAt: new Date().toISOString(),
      isRoot: false,
      isSystemFolder: true
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
    // NDIS Key Information Documents (System Protected)
    {
      id: 100,
      title: 'NDIS Overview & Fundamentals',
      content: `# NDIS Overview & Fundamentals

## What is the NDIS?

The National Disability Insurance Scheme (NDIS) is Australia's way of providing insurance for people with disability. It provides funding for supports and services that help people with disability live an ordinary life.

## Key Principles

### 1. Person-Centered Approach
- Participants choose their own goals
- Flexible support options
- Control over decision-making
- Individualized planning process

### 2. Early Intervention Focus
- Prevent deterioration of functional capacity
- Improve developmental outcomes
- Reduce future support needs
- Investment in long-term independence

### 3. Mainstream Integration
- Connect with community services
- Education and employment support
- Health system coordination
- Transport and housing integration

## NDIS Eligibility

### Age Requirements
- Under 65 years old when first accessing the scheme
- Australian citizen, permanent resident, or protected special category visa holder

### Disability Requirements
- **Permanent impairment** that is likely to be lifelong
- **Functional impact** that affects ability to take part effectively in activities
- **Support needs** that are likely to continue throughout life

### Early Intervention Requirements
- Impairment that may benefit from early intervention
- Support likely to reduce future support needs
- Evidence that intervention will be beneficial

## The Planning Process

### 1. Access Request
- Submit access request form
- Provide evidence of disability
- NDIA assessment of eligibility

### 2. Planning Meeting
- Discuss goals and aspirations
- Identify current supports
- Explore funded support needs
- Create NDIS plan

### 3. Plan Implementation
- Choose service providers
- Begin receiving supports
- Monitor progress towards goals

### 4. Plan Reviews
- Annual plan reviews (minimum)
- Request reviews when circumstances change
- Update goals and funding as needed

## Participant Rights

- **Choice and control** over supports and providers
- **Privacy and confidentiality** of personal information
- **Respect and dignity** in all interactions
- **Access to information** about rights and options
- **Complaints process** for concerns or disputes

## Support Coordination

### Types
- **Support Connection**: Help finding and connecting with providers
- **Support Coordination**: Assist with plan implementation and building capacity
- **Specialist Support Coordination**: Complex needs requiring specialized expertise

### Key Functions
- Understanding NDIS plans
- Finding appropriate providers
- Building participant capacity
- Coordinating multiple supports
- Crisis response and problem-solving`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'ndis-overview',
      categoryId: 'ndis-key-info',
      isSystemDocument: true
    },
    {
      id: 101,
      title: 'NDIS Funding Categories',
      content: `# NDIS Funding Categories

## Core Supports

Core supports help with daily life activities and are the foundation of every NDIS plan.

### Assistance with Daily Life
- **Personal care** (showering, dressing, toileting)
- **Domestic assistance** (cleaning, cooking, shopping)
- **Community participation** (social activities, recreation)
- **Transport** to access community, social, and recreational activities

### Consumables
- **Continence aids** and low-cost assistive technology
- **Equipment modifications** under $1,500
- **Vehicle modifications** under $1,500

### Transport
- **Public transport training**
- **Taxi transport** for disability-related needs
- **Specialized transport** where public transport isn't accessible

## Capital Supports

Capital supports are higher-cost items that help participants become more independent.

### Assistive Technology
- **Communication devices** (speech generating devices, tablets)
- **Mobility aids** (wheelchairs, walking frames, ramps)
- **Vision aids** (magnifiers, screen readers)
- **Hearing aids** and assistive listening devices
- **Environmental controls** (smart home technology)

### Home Modifications
- **Structural modifications** (ramps, bathroom modifications)
- **Accessibility improvements** (doorway widening, lighting)
- **Safety features** (grab rails, non-slip surfaces)

### Vehicle Modifications
- **Wheelchair access** (hoists, ramps)
- **Driving aids** (hand controls, spinner knobs)
- **Passenger safety** (specialized seating, restraints)

## Capacity Building

Capacity building supports help participants build skills and independence.

### Support Coordination
- **Support Connection** (12 months maximum)
- **Support Coordination** (ongoing as needed)
- **Specialist Support Coordination** (complex cases)

### Improved Living Arrangements
- **Assistance to live independently** (life skills development)
- **Finding and keeping a home** (tenancy support)
- **Household tasks** (meal planning, budgeting)

### Increased Social and Community Participation
- **Community connection** activities
- **Social skills development**
- **Recreational activities** and group programs
- **Peer support** programs

### Finding and Keeping a Job
- **Employment preparation** and job seeking skills
- **Workplace modifications** and support
- **Self-employment** assistance
- **Career counseling** and planning

### Improved Relationships
- **Communication skills** development
- **Relationship building** support
- **Family and carer support**
- **Conflict resolution** assistance

### Improved Health and Wellbeing
- **Exercise and fitness** programs
- **Mental health support**
- **Nutrition and meal planning**
- **Medication management**

### Improved Learning
- **Educational support** (not curriculum)
- **Study skills** development
- **Assistive technology** for learning
- **Transition planning** between education levels

### Improved Daily Living
- **Life skills** development
- **Personal care** skill building
- **Money management** and budgeting
- **Home safety** and maintenance

## SIL (Supported Independent Living)

### Overview
24/7 support for people with very high support needs who require help with daily tasks.

### Eligibility Criteria
- **High support needs** requiring assistance most of the time
- **Complex needs** requiring specialized disability support
- **Alternative options** have been considered and are not suitable

### Types of SIL
- **Individual arrangements** (1:1 support)
- **Shared arrangements** (1:2, 1:3, 1:4 ratios)
- **Group homes** with varying support levels

### SIL Review Process
- **Annual reviews** minimum
- **Participant choice** in providers and arrangements
- **Value for money** assessments
- **Outcomes measurement** and reporting

## Plan Management Options

### Self-Managed
- **Direct payment** to participant
- **Full control** over provider choice
- **Financial responsibility** for payments and reporting
- **Flexibility** in service delivery

### Plan-Managed
- **Plan manager** handles financial administration
- **Choice of any provider** (registered or unregistered)
- **No financial administration** burden on participant
- **Monthly reporting** provided

### NDIA-Managed
- **NDIA pays providers** directly
- **Must use registered providers** only
- **No financial administration** for participant
- **Limited provider choice**

### Mixed Management
- **Combination** of management types
- **Different categories** managed differently
- **Flexibility** based on participant needs and preferences`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'ndis-funding',
      categoryId: 'ndis-key-info',
      isSystemDocument: true
    },
    {
      id: 102,
      title: 'NDIS Support Categories & Line Items',
      content: `# NDIS Support Categories & Line Items

## Core Supports (01)

### 01_011 - Assistance with Daily Life Activities
- **Personal care**: Showering, dressing, toileting, grooming
- **Meal preparation**: Cooking, food preparation, eating assistance
- **Domestic assistance**: Cleaning, laundry, shopping
- **Community access**: Support to participate in community activities

### 01_012 - Assistance with Household Tasks
- **Cleaning**: General house cleaning, bathroom cleaning
- **Laundry**: Washing, drying, folding clothes
- **Shopping**: Grocery shopping, errands
- **Meal preparation**: Basic cooking and kitchen tasks

### 01_013 - Assistance with Self-Care Activities
- **Personal hygiene**: Washing, bathing, oral care
- **Dressing**: Getting dressed, choosing appropriate clothing
- **Mobility assistance**: Moving around home and community
- **Medication management**: Reminders and administration support

### 01_021 - Transport
- **Public transport training**: Learning to use buses, trains
- **Taxi transport**: Accessible taxi services
- **Community transport**: Specialized disability transport
- **Travel training**: Building independent travel skills

### 01_026 - Group and Centre Based Activities
- **Day programs**: Community-based group activities
- **Social programs**: Recreational and social participation
- **Life skills groups**: Learning practical skills in group settings
- **Respite services**: Short-term care and support

## Transport (02)

### 02_100 - Transport to Enable Social and Community Participation
- **Community access**: Transport to social activities
- **Recreation transport**: Access to leisure activities
- **Shopping trips**: Transport for essential errands
- **Medical appointments**: Non-disability related transport

## Consumables (03)

### 03_021 - Assistive Products for Personal Care and Safety
- **Continence aids**: Adult diapers, protective clothing
- **Bathroom safety**: Shower chairs, toilet frames
- **Mobility aids**: Walking sticks, wheelchairs under $1,500
- **Safety equipment**: Bed rails, sensor mats

### 03_022 - Assistive Products for Communication and Information
- **Communication aids**: Simple communication devices
- **Computer software**: Accessibility software
- **Mobile phones**: Basic accessible phones
- **Writing aids**: Adapted pens, grips

## Assistance with Social and Economic Participation (04)

### 04_101 - Assistance to Access and/or Maintain Employment or Education
- **Job coaching**: On-site employment support
- **Workplace modifications**: Equipment and environmental changes
- **Educational support**: Assistance with study activities
- **Transition support**: Moving between education and employment

### 04_102 - Finding and Keeping a Job
- **Job search assistance**: Resume writing, interview preparation
- **Career counseling**: Exploring employment options
- **Workplace assessment**: Identifying support needs
- **Employer engagement**: Working with employers on inclusion

### 04_103 - Assistance with Social, Economic and Community Participation
- **Community connection**: Building social networks
- **Volunteer work**: Support to participate in volunteering
- **Civic participation**: Voting, community meetings
- **Cultural activities**: Arts, sports, recreation participation

## Finding and Maintaining Accommodation (05)

### 05_100 - Assistance with Decision Making, Daily Planning and Budgeting
- **Financial planning**: Budgeting and money management
- **Decision support**: Help with important choices
- **Daily planning**: Organizing activities and appointments
- **Goal setting**: Identifying and working towards objectives

### 05_200 - Development of Daily Living and Life Skills
- **Cooking skills**: Learning to prepare meals
- **Cleaning skills**: Maintaining a clean home
- **Personal care**: Developing self-care routines
- **Social skills**: Building relationships and communication

## Increased Social and Community Participation (06)

### 06_100 - Therapeutic Supports
- **Physiotherapy**: Movement and mobility therapy
- **Occupational therapy**: Daily living skills therapy
- **Speech therapy**: Communication and swallowing therapy
- **Psychology**: Mental health and behavioral support

### 06_200 - Behaviour Support
- **Positive behavior support**: Developing behavior plans
- **Crisis intervention**: Emergency behavior support
- **Skill development**: Teaching alternative behaviors
- **Environmental modifications**: Reducing behavior triggers

## Improved Learning (07)

### 07_100 - Educational Support
- **Learning support**: Assistance with educational activities
- **Study skills**: Developing effective learning strategies
- **Educational planning**: Course selection and career planning
- **Transition support**: Moving between education levels

## Improved Health and Wellbeing (08)

### 08_100 - Nursing
- **Clinical care**: Medication administration, wound care
- **Health monitoring**: Vital signs, health assessments
- **Care coordination**: Working with medical professionals
- **Health education**: Teaching health management skills

### 08_200 - Allied Health
- **Dietetics**: Nutrition planning and support
- **Exercise physiology**: Fitness and mobility programs
- **Podiatry**: Foot care and mobility support
- **Mental health**: Counseling and psychological support

## Assistive Technology (09)

### 09_100 - Communication and Information Equipment
- **Speech devices**: Communication aids and software
- **Computer equipment**: Adapted computers and accessories
- **Environmental controls**: Smart home technology
- **Sensory equipment**: Hearing aids, magnifiers

### 09_200 - Recreation Equipment
- **Sports equipment**: Adapted sporting goods
- **Gaming devices**: Accessible entertainment technology
- **Musical instruments**: Adapted instruments
- **Art supplies**: Accessible creative materials

### 09_300 - Mobility Equipment
- **Wheelchairs**: Manual and electric wheelchairs
- **Walking aids**: Frames, sticks, crutches
- **Transfer equipment**: Hoists, transfer boards
- **Positioning equipment**: Seating and positioning aids

## Home Modifications (10)

### 10_100 - Household Tasks Equipment
- **Kitchen modifications**: Accessible benches, appliances
- **Cleaning equipment**: Adapted cleaning tools
- **Laundry modifications**: Accessible washing facilities
- **Storage solutions**: Accessible cupboards and shelving

### 10_200 - Personal Mobility Equipment
- **Ramps**: Portable and permanent ramps
- **Handrails**: Internal and external rails
- **Doorway modifications**: Widening and automation
- **Floor modifications**: Non-slip surfaces, level access

## Vehicle Modifications (11)

### 11_100 - Vehicle Modifications
- **Wheelchair access**: Hoists, ramps, lifts
- **Driving controls**: Hand controls, spinner knobs
- **Seating modifications**: Specialized car seats
- **Storage solutions**: Wheelchair and equipment storage

## Improved Daily Living (12)

### 12_100 - Assistance in Coordinating or Managing Life Stages, Transitions and Supports
- **Support coordination**: Plan implementation assistance
- **Life transitions**: Moving home, changing services
- **Crisis support**: Emergency assistance and planning
- **Capacity building**: Developing independence skills

## Supported Independent Living (13)

### 13_100 - Supported Independent Living
- **24/7 support**: Round-the-clock assistance
- **Shared living**: Support in group arrangements
- **Individual support**: 1:1 assistance arrangements
- **Overnight support**: Sleep-over and on-call support`,
      status: 'published',
      uploadedAt: new Date().toISOString(),
      folderId: 'ndis-supports',
      categoryId: 'ndis-key-info',
      isSystemDocument: true
    },
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

  const [showUpload, setShowUpload] = useState(false);

  // Handle login from LoginPage
  const handleLogin = (loginData) => {
    setCurrentUser(loginData.user);
    setUserType(loginData.userType);
    setIsManagerMode(loginData.isManagerMode);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setUserType('user');
    setIsManagerMode(false);
    setIsAuthenticated(false);
  };

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

  // Functions moved to top of component

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
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h2>🏥 NDIS Knowledge System</h2>
          <div className="user-info">
            <span className="user-badge">
              {userType === 'admin' ? '👨‍💼' : '👤'} 
              {userType === 'admin' ? 'Admin' : 'User'}
              {currentUser?.email && currentUser.email !== 'site-user@local' && ` - ${currentUser.email}`}
            </span>
          </div>
        </div>
        <div className="nav-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="search-input"
          />
        </div>
        <div className="nav-right">
          {userType === 'admin' && (
            <button
              onClick={() => setIsManagerMode(!isManagerMode)}
              className={`mode-toggle ${isManagerMode ? 'active' : ''}`}
              title={`Switch to ${isManagerMode ? 'User' : 'Manager'} mode`}
            >
              <span className="mode-icon">
                {isManagerMode ? '👤' : '👨‍💼'}
              </span>
              {isManagerMode ? 'User Mode' : 'Manager Mode'}
            </button>
          )}
          <button onClick={handleLogout} className="logout-button">
            <span className="logout-icon">🚪</span>
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
