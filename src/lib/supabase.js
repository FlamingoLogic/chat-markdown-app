import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    // Verify against site password (stored in environment or database)
    const correctPassword = process.env.REACT_APP_SITE_PASSWORD || 'demo123'
    
    if (sitePassword === correctPassword) {
      // Create a session record for user
      const sessionId = `user_${Date.now()}`
      const { error } = await supabase
        .from(TABLES.user_sessions)
        .insert({
          id: sessionId,
          user_type: 'user',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })

      if (error) {
        return { data: null, error }
      }

      return { 
        data: { 
          user: { 
            id: sessionId, 
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