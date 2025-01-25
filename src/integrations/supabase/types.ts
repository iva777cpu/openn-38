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
      reported_messages: {
        Row: {
          created_at: string
          explanation: string | null
          id: string
          message_text: string
          reported_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          id?: string
          message_text: string
          reported_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          explanation?: string | null
          id?: string
          message_text?: string
          reported_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      saved_messages: {
        Row: {
          created_at: string
          explanation: string | null
          id: string
          is_edited: boolean | null
          message_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          id?: string
          is_edited?: boolean | null
          message_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          explanation?: string | null
          id?: string
          is_edited?: boolean | null
          message_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          is_first_time: boolean | null
          previous_topics: string | null
          profile_name: string
          relationship: string | null
          situation: string | null
          target_age: string | null
          target_books: string | null
          target_dislikes: string | null
          target_gender: string | null
          target_hobbies: string | null
          target_humor: string | null
          target_loves: string | null
          target_mbti: string | null
          target_mood: string | null
          target_music: string | null
          target_origin: string | null
          target_personality: string | null
          target_style: string | null
          target_zodiac: string | null
          user_age: string | null
          user_gender: string | null
          user_id: string
          user_impression: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_first_time?: boolean | null
          previous_topics?: string | null
          profile_name: string
          relationship?: string | null
          situation?: string | null
          target_age?: string | null
          target_books?: string | null
          target_dislikes?: string | null
          target_gender?: string | null
          target_hobbies?: string | null
          target_humor?: string | null
          target_loves?: string | null
          target_mbti?: string | null
          target_mood?: string | null
          target_music?: string | null
          target_origin?: string | null
          target_personality?: string | null
          target_style?: string | null
          target_zodiac?: string | null
          user_age?: string | null
          user_gender?: string | null
          user_id: string
          user_impression?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_first_time?: boolean | null
          previous_topics?: string | null
          profile_name?: string
          relationship?: string | null
          situation?: string | null
          target_age?: string | null
          target_books?: string | null
          target_dislikes?: string | null
          target_gender?: string | null
          target_hobbies?: string | null
          target_humor?: string | null
          target_loves?: string | null
          target_mbti?: string | null
          target_mood?: string | null
          target_music?: string | null
          target_origin?: string | null
          target_personality?: string | null
          target_style?: string | null
          target_zodiac?: string | null
          user_age?: string | null
          user_gender?: string | null
          user_id?: string
          user_impression?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never