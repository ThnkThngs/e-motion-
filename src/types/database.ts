export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      invitations: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          slug: string;
          template_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload: Json;
          slug: string;
          template_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          slug?: string;
          template_id?: string;
        };
        Relationships: [];
      };
      rsvps: {
        Row: {
          attendance: string;
          created_at: string;
          guest_name: string;
          id: string;
          invitation_id: string;
          note: string | null;
          pax: number;
          phone: string | null;
        };
        Insert: {
          attendance: string;
          created_at?: string;
          guest_name: string;
          id?: string;
          invitation_id: string;
          note?: string | null;
          pax?: number;
          phone?: string | null;
        };
        Update: {
          attendance?: string;
          created_at?: string;
          guest_name?: string;
          id?: string;
          invitation_id?: string;
          note?: string | null;
          pax?: number;
          phone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey";
            columns: ["invitation_id"];
            isOneToOne: false;
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          },
        ];
      };
      ucapan: {
        Row: {
          created_at: string;
          guest_name: string;
          id: string;
          invitation_id: string;
          message: string;
        };
        Insert: {
          created_at?: string;
          guest_name: string;
          id?: string;
          invitation_id: string;
          message: string;
        };
        Update: {
          created_at?: string;
          guest_name?: string;
          id?: string;
          invitation_id?: string;
          message?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ucapan_invitation_id_fkey";
            columns: ["invitation_id"];
            isOneToOne: false;
            referencedRelation: "invitations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
