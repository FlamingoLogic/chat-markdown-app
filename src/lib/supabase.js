// Mock Supabase client for demo purposes
// Replace with real Supabase configuration when ready
const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      // Mock admin login
      if (email === 'admin@demo.com' && password === 'admin123') {
        return {
          data: {
            user: {
              id: 'admin-user-id',
              email: 'admin@demo.com',
              user_type: 'admin'
            }
          },
          error: null
        }
      }
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      }
    },
    signOut: async () => {
      return { error: null }
    },
    getUser: async () => {
      return { data: null, error: null }
    }
  },
  from: (table) => ({
    insert: async (data) => {
      // Mock database insert
      console.log('Mock insert:', table, data)
      return { error: null }
    }
  })
}

export const supabase = mockSupabase

// Storage bucket for PDFs
export const PDF_BUCKET = 'pdf-uploads'

// Table names
export const TABLES = {
  documents: 'documents',
  folders: 'folders',
  processing_jobs: 'processing_jobs',
  user_sessions: 'user_sessions'
}

// Authentication helpers
export const auth = {
  // Admin login with email/password
  signInAdmin: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // User login with site password
  signInUser: async (sitePassword) => {
    // Simple password check for demo
    const correctPassword = 'demo123'
    
    if (sitePassword === correctPassword) {
      return { 
        data: { 
          user: { 
            id: `user_${Date.now()}`, 
            user_type: 'user',
            email: 'site-user@local'
          } 
        }, 
        error: null 
      }
    } else {
      return { 
        data: null, 
        error: { message: 'Invalid site password' } 
      }
    }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  }
} 