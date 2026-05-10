export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: {
          id: string
          text: string
          category: string
          difficulty: 'easy' | 'medium' | 'hard'
          language: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          category: string
          difficulty?: 'easy' | 'medium' | 'hard'
          language?: string
          source?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['topics']['Insert']>
      }
      recordings: {
        Row: {
          id: string
          topic_text: string
          topic_id: string | null
          topic_category: string | null
          framework_hint: string | null
          type: 'audio' | 'video'
          duration_target: number
          duration_actual: number
          file_path: string
          created_at: string
          processed_at: string | null
          status: 'recorded' | 'transcribing' | 'analyzing' | 'done' | 'error'
        }
        Insert: {
          id?: string
          topic_text: string
          topic_id?: string | null
          topic_category?: string | null
          framework_hint?: string | null
          type: 'audio' | 'video'
          duration_target: number
          duration_actual: number
          file_path: string
          created_at?: string
          processed_at?: string | null
          status?: 'recorded' | 'transcribing' | 'analyzing' | 'done' | 'error'
        }
        Update: Partial<Database['public']['Tables']['recordings']['Insert']>
      }
      transcripts: {
        Row: {
          recording_id: string
          text: string
          words: Json | null
          segments: Json | null
        }
        Insert: {
          recording_id: string
          text: string
          words?: Json | null
          segments?: Json | null
        }
        Update: Partial<Database['public']['Tables']['transcripts']['Insert']>
      }
      metrics: {
        Row: {
          recording_id: string
          wpm: number | null
          word_count: number | null
          filler_count: number | null
          filler_ratio: number | null
          hedging_count: number | null
          hedging_ratio: number | null
          long_pauses: number | null
          first_word_latency: number | null
        }
        Insert: {
          recording_id: string
          wpm?: number | null
          word_count?: number | null
          filler_count?: number | null
          filler_ratio?: number | null
          hedging_count?: number | null
          hedging_ratio?: number | null
          long_pauses?: number | null
          first_word_latency?: number | null
        }
        Update: Partial<Database['public']['Tables']['metrics']['Insert']>
      }
      feedback: {
        Row: {
          recording_id: string
          overall_score: number | null
          summary: string | null
          data: Json
          model: string
          created_at: string
        }
        Insert: {
          recording_id: string
          overall_score?: number | null
          summary?: string | null
          data: Json
          model: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['feedback']['Insert']>
      }
      tags: {
        Row: {
          id: string
          recording_id: string
          label: string
        }
        Insert: {
          id?: string
          recording_id: string
          label: string
        }
        Update: Partial<Database['public']['Tables']['tags']['Insert']>
      }
      notes: {
        Row: {
          recording_id: string
          text: string | null
          updated_at: string
        }
        Insert: {
          recording_id: string
          text?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['notes']['Insert']>
      }
    }
  }
}

// Convenience row types
export type Topic = Database['public']['Tables']['topics']['Row']
export type Recording = Database['public']['Tables']['recordings']['Row']
export type Transcript = Database['public']['Tables']['transcripts']['Row']
export type Metrics = Database['public']['Tables']['metrics']['Row']
export type FeedbackRow = Database['public']['Tables']['feedback']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Note = Database['public']['Tables']['notes']['Row']

export type RecordingStatus = Recording['status']

// Whisper word-level timestamp shape stored in transcripts.words
export interface WhisperWord {
  word: string
  start: number
  end: number
}

export interface WhisperSegment {
  id: number
  start: number
  end: number
  text: string
}
