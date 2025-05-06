export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
          price: number;
          category: string;
          inventory_count: number;
          image_url: string;
          featured: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          inventory_count: number;
          image_url: string;
          featured?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          inventory_count?: number;
          image_url?: string;
          featured?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          status: string;
          total: number;
          shipping_address: Json;
          payment_intent: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          status: string;
          total: number;
          shipping_address: Json;
          payment_intent?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          status?: string;
          total?: number;
          shipping_address?: Json;
          payment_intent?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          addresses: Json[] | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          addresses?: Json[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          addresses?: Json[] | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
