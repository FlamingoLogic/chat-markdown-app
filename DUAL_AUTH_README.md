# 🔐 Dual Authentication System - NDIS Knowledge Portal

## 🚀 **Authentication Types**

### **1. User Access (Site Password)**
- **Login Type**: Site-wide password authentication
- **Default Password**: `demo123` (configurable)
- **Access Level**: Read-only access to published documents
- **Features**:
  - 📖 View published documents
  - 🔍 Search knowledge base
  - 💬 AI chat assistance
  - 📁 Browse categories

### **2. Admin Access (Email & Password)**
- **Login Type**: Email/password authentication via Supabase
- **Access Level**: Full management capabilities
- **Features**:
  - 📝 Create & edit documents
  - 📄 Upload PDF files (with AI processing)
  - 🤖 PDF to Markdown conversion
  - 👥 User management
  - 📊 Analytics dashboard
  - 🔄 Toggle between Admin/User modes

## 🛠 **Setup Instructions**

### **1. Environment Configuration**

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Password for User Access
REACT_APP_SITE_PASSWORD=demo123

# N8N Webhook for PDF Processing
REACT_APP_N8N_WEBHOOK_URL=your-n8n-webhook-url

# Production Settings
REACT_APP_ENVIRONMENT=development
```

### **2. Supabase Setup**

#### **Database Schema**

Run these SQL commands in your Supabase dashboard:

```sql
-- Documents table (enhanced)
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  folder_id TEXT,
  category_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_system_document BOOLEAN DEFAULT FALSE,
  original_pdf_url TEXT,
  processing_job_id TEXT
);

-- Folders table (enhanced)
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  category_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_root BOOLEAN DEFAULT FALSE,
  is_system_folder BOOLEAN DEFAULT FALSE
);

-- Processing jobs table
CREATE TABLE processing_jobs (
  id TEXT PRIMARY KEY,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  result TEXT, -- The final markdown content
  error_message TEXT,
  folder_id TEXT,
  category_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- User sessions table (for site password users)
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_type TEXT NOT NULL, -- 'user' or 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### **Storage Bucket**

Create a storage bucket called `pdf-uploads` in your Supabase dashboard:
- Bucket name: `pdf-uploads`
- Public: `false`
- File size limit: `50MB`
- Allowed MIME types: `application/pdf`

#### **Authentication**

Set up authentication in Supabase:
1. Enable Email/Password authentication
2. Create admin users via Supabase dashboard
3. Set up Row Level Security (RLS) policies as needed

### **3. Admin User Creation**

To create admin users:

1. **Via Supabase Dashboard:**
   - Go to Authentication > Users
   - Click "Invite a user"
   - Enter admin email and password
   - The user will have admin access

2. **Via SQL:**
   ```sql
   -- Insert admin user (replace with actual details)
   INSERT INTO auth.users (
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at
   ) VALUES (
     'admin@yourdomain.com',
     crypt('your-password', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW()
   );
   ```

### **4. Run the Application**

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## 🔑 **Login Instructions**

### **For Users:**
1. Select "User Access" on the login page
2. Enter the site password: `demo123`
3. Click "Access Site"

### **For Admins:**
1. Select "Admin Access" on the login page
2. Enter your admin email and password
3. Click "Admin Login"
4. Use the mode toggle to switch between Admin/User views

## 🤖 **PDF Processing Features**

### **For Admins Only:**

1. **Upload PDF**: Drag and drop or select PDF files
2. **AI Processing**: Automatic conversion to structured Markdown
3. **Real-time Progress**: Visual feedback during processing
4. **Error Handling**: Graceful error messages and retry options

### **Processing Flow:**
1. PDF uploaded to Supabase Storage
2. Processing job created in database
3. N8N workflow triggered for text extraction
4. OpenAI processes content into structured Markdown
5. Result saved and displayed in the app

## 🎯 **Key Features**

### **Security:**
- ✅ Dual authentication system
- ✅ Role-based access control
- ✅ Secure file storage
- ✅ Session management

### **User Experience:**
- ✅ Intuitive login selection
- ✅ Visual processing feedback
- ✅ Responsive design
- ✅ Real-time updates

### **Content Management:**
- ✅ Document categorization
- ✅ Folder organization
- ✅ Status management (Draft/Published)
- ✅ System-protected content

### **AI Integration:**
- ✅ PDF text extraction
- ✅ Markdown conversion
- ✅ Structured content formatting
- ✅ Error recovery

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Login Failed:**
   - Check Supabase configuration
   - Verify environment variables
   - Ensure admin user exists

2. **PDF Processing Failed:**
   - Check N8N webhook URL
   - Verify OpenAI API key in N8N
   - Check file size limits

3. **Documents Not Visible:**
   - Check user mode (Admin vs User)
   - Verify document status (published)
   - Check folder permissions

### **Environment Variables:**
Make sure all required environment variables are set:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_SITE_PASSWORD`
- `REACT_APP_N8N_WEBHOOK_URL`

## 📞 **Support**

For issues or questions:
1. Check the troubleshooting section above
2. Verify your Supabase and N8N configurations
3. Review the browser console for error messages
4. Ensure all dependencies are installed

---

**🏥 NDIS Knowledge System** - Empowering teams with intelligent document management and AI-powered content processing. 