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
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          month: number
          user_id: string
          year: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          month: number
          user_id: string
          year: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          month?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      classification_patterns: {
        Row: {
          classification: Database["public"]["Enums"]["expense_classification"]
          confidence_score: number | null
          created_at: string
          id: string
          pattern_type: string
          pattern_value: string
          planning_status: Database["public"]["Enums"]["expense_planning"]
          updated_at: string
          user_id: string
        }
        Insert: {
          classification: Database["public"]["Enums"]["expense_classification"]
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_type: string
          pattern_value: string
          planning_status: Database["public"]["Enums"]["expense_planning"]
          updated_at?: string
          user_id: string
        }
        Update: {
          classification?: Database["public"]["Enums"]["expense_classification"]
          confidence_score?: number | null
          created_at?: string
          id?: string
          pattern_type?: string
          pattern_value?: string
          planning_status?: Database["public"]["Enums"]["expense_planning"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          amount: number
          contribution_date: string
          created_at: string
          goal_id: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          contribution_date?: string
          created_at?: string
          goal_id: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          contribution_date?: string
          created_at?: string
          goal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          celebrated_at: string | null
          created_at: string
          current_amount: number
          id: string
          name: string
          target_amount: number
          target_date: string | null
          user_id: string
        }
        Insert: {
          celebrated_at?: string | null
          created_at?: string
          current_amount?: number
          id?: string
          name: string
          target_amount: number
          target_date?: string | null
          user_id: string
        }
        Update: {
          celebrated_at?: string | null
          created_at?: string
          current_amount?: number
          id?: string
          name?: string
          target_amount?: number
          target_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      installment_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          installment_number: number
          installment_plan_id: string
          payment_date: string
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          installment_number: number
          installment_plan_id: string
          payment_date: string
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          installment_number?: number
          installment_plan_id?: string
          payment_date?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_payments_installment_plan_id_fkey"
            columns: ["installment_plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          installment_amount: number
          is_active: boolean
          paid_installments: number
          start_date: string
          total_amount: number
          total_installments: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          installment_amount: number
          is_active?: boolean
          paid_installments?: number
          start_date: string
          total_amount: number
          total_installments: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          installment_amount?: number
          is_active?: boolean
          paid_installments?: number
          start_date?: string
          total_amount?: number
          total_installments?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          avatar_url: string | null
          full_name: string | null
          id: string
          plan: Database["public"]["Enums"]["app_plan"]
          trial_ends_at: string | null
        }
        Insert: {
          avatar_path?: string | null
          avatar_url?: string | null
          full_name?: string | null
          id: string
          plan?: Database["public"]["Enums"]["app_plan"]
          trial_ends_at?: string | null
        }
        Update: {
          avatar_path?: string | null
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["app_plan"]
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          end_date: string | null
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
          id: string
          is_active: boolean
          next_execution_date: string
          start_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          end_date?: string | null
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          is_active?: boolean
          next_execution_date: string
          start_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          is_active?: boolean
          next_execution_date?: string
          start_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          classification:
            | Database["public"]["Enums"]["expense_classification"]
            | null
          created_at: string
          description: string | null
          id: string
          is_auto_classified: boolean | null
          planning_status:
            | Database["public"]["Enums"]["expense_planning"]
            | null
          recurrence_pattern: string | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          classification?:
            | Database["public"]["Enums"]["expense_classification"]
            | null
          created_at?: string
          description?: string | null
          id?: string
          is_auto_classified?: boolean | null
          planning_status?:
            | Database["public"]["Enums"]["expense_planning"]
            | null
          recurrence_pattern?: string | null
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          classification?:
            | Database["public"]["Enums"]["expense_classification"]
            | null
          created_at?: string
          description?: string | null
          id?: string
          is_auto_classified?: boolean | null
          planning_status?:
            | Database["public"]["Enums"]["expense_planning"]
            | null
          recurrence_pattern?: string | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_execution_date: {
        Args: {
          input_date: string
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
        }
        Returns: string
      }
    }
    Enums: {
      app_plan: "free" | "premium"
      expense_classification: "fixed" | "variable"
      expense_planning: "planned" | "unplanned"
      recurrence_frequency:
        | "monthly"
        | "bimonthly"
        | "quarterly"
        | "semiannual"
        | "annual"
      transaction_type: "income" | "expense"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_plan: ["free", "premium"],
      expense_classification: ["fixed", "variable"],
      expense_planning: ["planned", "unplanned"],
      recurrence_frequency: [
        "monthly",
        "bimonthly",
        "quarterly",
        "semiannual",
        "annual",
      ],
      transaction_type: ["income", "expense"],
    },
  },
} as const
