export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          certificate_url: string | null
          created_at: string
          date: string | null
          description: string
          event_name: string | null
          id: string
          title: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          date?: string | null
          description: string
          event_name?: string | null
          id?: string
          title?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          date?: string | null
          description?: string
          event_name?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          end_year: number | null
          field: string | null
          grade: string | null
          id: string
          institution: string
          start_year: number
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          end_year?: number | null
          field?: string | null
          grade?: string | null
          id?: string
          institution: string
          start_year: number
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          end_year?: number | null
          field?: string | null
          grade?: string | null
          id?: string
          institution?: string
          start_year?: number
        }
        Relationships: []
      }
      profile: {
        Row: {
          about_text: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          github_url: string | null
          headline: string | null
          id: string
          leetcode_rank: string | null
          leetcode_url: string | null
          linkedin_url: string | null
          location: string | null
          name: string
          resume_url: string | null
          subheadline: string | null
          updated_at: string
        }
        Insert: {
          about_text?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          leetcode_rank?: string | null
          leetcode_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          resume_url?: string | null
          subheadline?: string | null
          updated_at?: string
        }
        Update: {
          about_text?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          leetcode_rank?: string | null
          leetcode_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          resume_url?: string | null
          subheadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
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
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
