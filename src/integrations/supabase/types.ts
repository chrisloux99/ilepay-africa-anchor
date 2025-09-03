export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      anchor_transactions: {
        Row: {
          amount_fee: number | null
          amount_in: number | null
          amount_out: number | null
          anchor_id: string | null
          asset_code: string
          asset_issuer: string | null
          completed_at: string | null
          created_at: string
          external_tx_id: string | null
          id: string
          kind: string
          memo: string | null
          memo_type: string | null
          more_info_url: string | null
          refunds: Json | null
          sep24_interactive_url: string | null
          started_at: string
          status: string
          status_message: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_fee?: number | null
          amount_in?: number | null
          amount_out?: number | null
          anchor_id?: string | null
          asset_code: string
          asset_issuer?: string | null
          completed_at?: string | null
          created_at?: string
          external_tx_id?: string | null
          id?: string
          kind: string
          memo?: string | null
          memo_type?: string | null
          more_info_url?: string | null
          refunds?: Json | null
          sep24_interactive_url?: string | null
          started_at?: string
          status?: string
          status_message?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_fee?: number | null
          amount_in?: number | null
          amount_out?: number | null
          anchor_id?: string | null
          asset_code?: string
          asset_issuer?: string | null
          completed_at?: string | null
          created_at?: string
          external_tx_id?: string | null
          id?: string
          kind?: string
          memo?: string | null
          memo_type?: string | null
          more_info_url?: string | null
          refunds?: Json | null
          sep24_interactive_url?: string | null
          started_at?: string
          status?: string
          status_message?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_status: {
        Row: {
          anchor_customer_id: string | null
          created_at: string
          fields: Json | null
          id: string
          last_error: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anchor_customer_id?: string | null
          created_at?: string
          fields?: Json | null
          id?: string
          last_error?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anchor_customer_id?: string | null
          created_at?: string
          fields?: Json | null
          id?: string
          last_error?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string
          display_name: string | null
          id: string
          phone_number: string | null
          security_settings: Json | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone_number?: string | null
          security_settings?: Json | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone_number?: string | null
          security_settings?: Json | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      stellar_wallets: {
        Row: {
          created_at: string
          id: string
          public_key: string
          tokens_distributed: boolean
          updated_at: string
          user_id: string
          welcome_tokens_amount: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          public_key: string
          tokens_distributed?: boolean
          updated_at?: string
          user_id: string
          welcome_tokens_amount?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          public_key?: string
          tokens_distributed?: boolean
          updated_at?: string
          user_id?: string
          welcome_tokens_amount?: number | null
        }
        Relationships: []
      }
      telecom_services: {
        Row: {
          active: boolean
          amount: number
          created_at: string
          data_amount: string | null
          id: string
          package_name: string
          provider: string
          service_type: string
          validity_days: number | null
        }
        Insert: {
          active?: boolean
          amount: number
          created_at?: string
          data_amount?: string | null
          id?: string
          package_name: string
          provider: string
          service_type: string
          validity_days?: number | null
        }
        Update: {
          active?: boolean
          amount?: number
          created_at?: string
          data_amount?: string | null
          id?: string
          package_name?: string
          provider?: string
          service_type?: string
          validity_days?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          asset_code: string
          asset_issuer: string | null
          created_at: string
          id: string
          memo: string | null
          phone_number: string | null
          recipient_address: string | null
          sender_address: string | null
          service_type: string | null
          status: string
          stellar_tx_hash: string | null
          telecom_provider: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          asset_code: string
          asset_issuer?: string | null
          created_at?: string
          id?: string
          memo?: string | null
          phone_number?: string | null
          recipient_address?: string | null
          sender_address?: string | null
          service_type?: string | null
          status?: string
          stellar_tx_hash?: string | null
          telecom_provider?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_code?: string
          asset_issuer?: string | null
          created_at?: string
          id?: string
          memo?: string | null
          phone_number?: string | null
          recipient_address?: string | null
          sender_address?: string | null
          service_type?: string | null
          status?: string
          stellar_tx_hash?: string | null
          telecom_provider?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          asset_code: string
          asset_issuer: string | null
          balance: number
          created_at: string
          frozen: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_code?: string
          asset_issuer?: string | null
          balance?: number
          created_at?: string
          frozen?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_code?: string
          asset_issuer?: string | null
          balance?: number
          created_at?: string
          frozen?: boolean
          id?: string
          updated_at?: string
          user_id?: string
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
    Enums: {},
  },
} as const
