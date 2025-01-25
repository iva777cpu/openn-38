export interface ReportedMessagesTable {
  Row: {
    id: string;
    message_text: string;
    reported_by: string | null;
    status: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    message_text: string;
    reported_by?: string | null;
    status?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    message_text?: string;
    reported_by?: string | null;
    status?: string | null;
    created_at?: string;
  };
}

export interface SavedMessagesTable {
  Row: {
    id: string;
    user_id: string;
    message_text: string;
    created_at: string;
    is_edited: boolean | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    message_text: string;
    created_at?: string;
    is_edited?: boolean | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    message_text?: string;
    created_at?: string;
    is_edited?: boolean | null;
  };
}

export interface UserPreferencesTable {
  Row: {
    id: string;
    user_id: string;
    theme: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    theme?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    theme?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface UserProfilesTable {
  Row: {
    id: string;
    user_id: string;
    profile_name: string;
    user_age: string | null;
    user_gender: string | null;
    user_impression: string | null;
    target_age: string | null;
    target_gender: string | null;
    target_mood: string | null;
    created_at: string;
    target_origin: string | null;
    target_loves: string | null;
    target_dislikes: string | null;
    target_hobbies: string | null;
    target_books: string | null;
    target_music: string | null;
    target_humor: string | null;
    target_zodiac: string | null;
    target_mbti: string | null;
    target_style: string | null;
    situation: string | null;
    previous_topics: string | null;
    target_personality: string | null;
    relationship: string | null;
    is_first_time: boolean | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    profile_name: string;
    user_age?: string | null;
    user_gender?: string | null;
    user_impression?: string | null;
    target_age?: string | null;
    target_gender?: string | null;
    target_mood?: string | null;
    created_at?: string;
    target_origin?: string | null;
    target_loves?: string | null;
    target_dislikes?: string | null;
    target_hobbies?: string | null;
    target_books?: string | null;
    target_music?: string | null;
    target_humor?: string | null;
    target_zodiac?: string | null;
    target_mbti?: string | null;
    target_style?: string | null;
    situation?: string | null;
    previous_topics?: string | null;
    target_personality?: string | null;
    relationship?: string | null;
    is_first_time?: boolean | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    profile_name?: string;
    user_age?: string | null;
    user_gender?: string | null;
    user_impression?: string | null;
    target_age?: string | null;
    target_gender?: string | null;
    target_mood?: string | null;
    created_at?: string;
    target_origin?: string | null;
    target_loves?: string | null;
    target_dislikes?: string | null;
    target_hobbies?: string | null;
    target_books?: string | null;
    target_music?: string | null;
    target_humor?: string | null;
    target_zodiac?: string | null;
    target_mbti?: string | null;
    target_style?: string | null;
    situation?: string | null;
    previous_topics?: string | null;
    target_personality?: string | null;
    relationship?: string | null;
    is_first_time?: boolean | null;
  };
}