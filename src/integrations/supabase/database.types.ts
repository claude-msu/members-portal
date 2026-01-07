export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          board_positions: string[] | null
          class_ids: string[] | null
          class_role: Database["public"]["Enums"]["class_member_type"] | null
          class_year: string
          created_at: string
          full_name: string
          id: string
          other_commitments: string | null
          previous_experience: string | null
          problem_solved: string | null
          project_detail: string | null
          project_ids: string[] | null
          project_role: Database["public"]["Enums"]["project_member_type"] | null
          relevant_experience: string | null
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"]
          transcript_url: string | null
          updated_at: string
          user_id: string
          why_join: string | null
          why_position: string | null
        }
        Insert: {
          application_type: Database["public"]["Enums"]["application_type"]
          board_positions?: string[] | null
          class_ids?: string[] | null
          class_role?: Database["public"]["Enums"]["class_member_type"] | null
          class_year: string
          created_at?: string
          full_name: string
          id?: string
          other_commitments?: string | null
          previous_experience?: string | null
          problem_solved?: string | null
          project_detail?: string | null
          project_ids?: string[] | null
          project_role?: Database["public"]["Enums"]["project_member_type"] | null
          relevant_experience?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          transcript_url?: string | null
          updated_at?: string
          user_id: string
          why_join?: string | null
          why_position?: string | null
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          board_positions?: string[] | null
          class_ids?: string[] | null
          class_role?: Database["public"]["Enums"]["class_member_type"] | null
          class_year?: string
          created_at?: string
          full_name?: string
          id?: string
          other_commitments?: string | null
          previous_experience?: string | null
          problem_solved?: string | null
          project_detail?: string | null
          project_ids?: string[] | null
          project_role?: Database["public"]["Enums"]["project_member_type"] | null
          relevant_experience?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          transcript_url?: string | null
          updated_at?: string
          user_id?: string
          why_join?: string | null
          why_position?: string | null
        }
        Relationships: []
      }
      class_enrollments: {
        Row: {
          class_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["class_member_type"]
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["class_member_type"]
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["class_member_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          location: string | null
          name: string
          schedule: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attended: boolean
          attended_at: string | null
          created_at: string
          event_id: string
          id: string
          rsvped_at: string
          user_id: string
        }
        Insert: {
          attended?: boolean
          attended_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          rsvped_at?: string
          user_id: string
        }
        Update: {
          attended?: boolean
          attended_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          rsvped_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          allowed_roles: Database["public"]["Enums"]["app_role"][]
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          id: string
          location: string
          max_attendance: number
          name: string
          points: number
          qr_code_token: string
          rsvp_required: boolean
          updated_at: string
        }
        Insert: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          id?: string
          location: string
          max_attendance?: number
          name: string
          points?: number
          qr_code_token?: string
          rsvp_required?: boolean
          updated_at?: string
        }
        Update: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string
          max_attendance?: number
          name?: string
          points?: number
          qr_code_token?: string
          rsvp_required?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          class_year: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          linkedin_url: string | null
          points: number
          profile_picture_url: string | null
          resume_url: string | null
          updated_at: string
        }
        Insert: {
          class_year?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          linkedin_url?: string | null
          points?: number
          profile_picture_url?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Update: {
          class_year?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          linkedin_url?: string | null
          points?: number
          profile_picture_url?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_member_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role: Database["public"]["Enums"]["project_member_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_member_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          github_url: string
          id: string
          lead_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          github_url: string
          id?: string
          lead_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          github_url?: string
          id?: string
          lead_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: {
          _user_id: string
        }
        Returns: {
          id: string
          email: string
          full_name: string
          class_year: string | null
          linkedin_url: string | null
          resume_url: string | null
          profile_picture_url: string | null
          points: number
          role: Database["public"]["Enums"]["app_role"] | null
        }[]
      }
      get_user_role: {
        Args: {
          _user_id: string
        }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "prospect" | "member" | "board" | "e-board"
      application_status: "pending" | "accepted" | "rejected"
      application_type: "club_admission" | "board" | "project" | "class"
      class_member_type: "teacher" | "student"
      project_member_type: "lead" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}