export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          phone_number: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean;
        };
        Update: {
          label?: string;
          full_name?: string;
          phone?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          product_type: "single_flower" | "mini_bouquet" | "premium_bouquet" | "luxury_bouquet" | "custom_bouquet" | "gift_bundle";
          status: "draft" | "active" | "hidden" | "archived";
          category_id: string | null;
          base_price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          sku: string | null;
          tags: string[];
          is_featured: boolean;
          is_bestseller: boolean;
          is_new_arrival: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          product_type?: "single_flower" | "mini_bouquet" | "premium_bouquet" | "luxury_bouquet" | "custom_bouquet" | "gift_bundle";
          status?: "draft" | "active" | "hidden" | "archived";
          category_id?: string | null;
          base_price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          tags?: string[];
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new_arrival?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          product_type?: "single_flower" | "mini_bouquet" | "premium_bouquet" | "luxury_bouquet" | "custom_bouquet" | "gift_bundle";
          status?: "draft" | "active" | "hidden" | "archived";
          category_id?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          tags?: string[];
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_new_arrival?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
        Update: {
          url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price: number;
          compare_at_price: number | null;
          options: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku?: string | null;
          price: number;
          compare_at_price?: number | null;
          options?: Json;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          sku?: string | null;
          price?: number;
          compare_at_price?: number | null;
          options?: Json;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          email: string;
          phone: string | null;
          status: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          discount_amount: number;
          shipping_amount: number;
          tax_amount: number;
          total: number;
          shipping_address: Json;
          billing_address: Json | null;
          payment_method: "razorpay" | "stripe" | "cod" | null;
          payment_status: "pending" | "authorized" | "captured" | "failed" | "refunded";
          coupon_id: string | null;
          coupon_code: string | null;
          gift_note: string | null;
          internal_notes: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          estimated_delivery: string | null;
          confirmed_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          email: string;
          phone?: string | null;
          status?: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          discount_amount?: number;
          shipping_amount?: number;
          tax_amount?: number;
          total: number;
          shipping_address: Json;
          billing_address?: Json | null;
          payment_method?: "razorpay" | "stripe" | "cod" | null;
          payment_status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
          coupon_id?: string | null;
          coupon_code?: string | null;
          gift_note?: string | null;
        };
        Update: {
          status?: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
          payment_method?: "razorpay" | "stripe" | "cod" | null;
          payment_status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
          internal_notes?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          estimated_delivery?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          custom_request_id: string | null;
          product_name: string;
          variant_name: string | null;
          product_image: string | null;
          sku: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          custom_request_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          product_image?: string | null;
          sku?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          coupon_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          coupon_id?: string | null;
        };
        Update: {
          coupon_id?: string | null;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          custom_request_id: string | null;
          gift_note: string | null;
          added_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          custom_request_id?: string | null;
          gift_note?: string | null;
        };
        Update: {
          quantity?: number;
          gift_note?: string | null;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_amount: number;
          max_discount_amount: number | null;
          usage_limit: number | null;
          used_count: number;
          per_user_limit: number;
          is_active: boolean;
          starts_at: string | null;
          expires_at: string | null;
          applicable_products: string[] | null;
          applicable_collections: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          usage_limit?: number | null;
          per_user_limit?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          applicable_products?: string[] | null;
          applicable_collections?: string[] | null;
        };
        Update: {
          code?: string;
          description?: string | null;
          discount_type?: "percentage" | "fixed";
          discount_value?: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          usage_limit?: number | null;
          per_user_limit?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
        };
      };
      custom_bouquet_requests: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          flower_types: string[];
          colors: string[];
          bouquet_size: string;
          wrapping_style: string | null;
          ribbon_style: string | null;
          greeting_card: boolean;
          card_message: string | null;
          special_notes: string | null;
          delivery_date: string | null;
          estimated_price: number | null;
          final_price: number | null;
          status: "pending" | "reviewed" | "approved" | "rejected" | "priced" | "converted" | "in_production" | "completed";
          admin_notes: string | null;
          rejection_reason: string | null;
          order_id: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          flower_types?: string[];
          colors?: string[];
          bouquet_size?: string;
          wrapping_style?: string | null;
          ribbon_style?: string | null;
          greeting_card?: boolean;
          card_message?: string | null;
          special_notes?: string | null;
          delivery_date?: string | null;
        };
        Update: {
          status?: "pending" | "reviewed" | "approved" | "rejected" | "priced" | "converted" | "in_production" | "completed";
          estimated_price?: number | null;
          final_price?: number | null;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          order_id?: string | null;
          reviewed_at?: string | null;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
        };
        Update: Record<string, never>;
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string;
          variant_id: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          wishlist_id: string;
          product_id: string;
          variant_id?: string | null;
        };
        Update: Record<string, never>;
      };
      saved_designs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          config: Json;
          preview_url: string | null;
          estimated_price: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          config?: Json;
          preview_url?: string | null;
          estimated_price?: number | null;
        };
        Update: {
          name?: string;
          config?: Json;
          preview_url?: string | null;
          estimated_price?: number | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "order_update" | "custom_bouquet" | "promotion" | "system";
          title: string;
          message: string;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "order_update" | "custom_bouquet" | "promotion" | "system";
          title: string;
          message: string;
          data?: Json;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
      shipping_rates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          min_order_amount: number;
          max_order_amount: number | null;
          rate: number;
          estimated_days_min: number | null;
          estimated_days_max: number | null;
          is_active: boolean;
          zones: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          min_order_amount?: number;
          max_order_amount?: number | null;
          rate: number;
          estimated_days_min?: number | null;
          estimated_days_max?: number | null;
          is_active?: boolean;
          zones?: string[];
        };
        Update: {
          name?: string;
          description?: string | null;
          min_order_amount?: number;
          max_order_amount?: number | null;
          rate?: number;
          estimated_days_min?: number | null;
          estimated_days_max?: number | null;
          is_active?: boolean;
          zones?: string[];
        };
      };
      faq: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          question?: string;
          answer?: string;
          category?: string;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          customer_avatar: string | null;
          rating: number;
          content: string;
          product_id: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_avatar?: string | null;
          rating: number;
          content: string;
          product_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          customer_name?: string;
          customer_avatar?: string | null;
          rating?: number;
          content?: string;
          product_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string | null;
          image_url: string;
          caption: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          title?: string | null;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      hero_sections: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          image_url: string | null;
          cta_text: string | null;
          cta_link: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
        };
        Update: {
          value?: Json;
        };
      };
      inventory: {
        Row: {
          id: string;
          product_id: string | null;
          variant_id: string | null;
          quantity: number;
          low_stock_threshold: number;
          track_inventory: boolean;
          allow_backorder: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          quantity?: number;
          low_stock_threshold?: number;
          track_inventory?: boolean;
          allow_backorder?: boolean;
        };
        Update: {
          quantity?: number;
          low_stock_threshold?: number;
          track_inventory?: boolean;
          allow_backorder?: boolean;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          method: "razorpay" | "stripe" | "cod";
          status: "pending" | "authorized" | "captured" | "failed" | "refunded";
          amount: number;
          currency: string;
          provider_payment_id: string | null;
          provider_order_id: string | null;
          provider_signature: string | null;
          provider_data: Json;
          paid_at: string | null;
          refunded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          method: "razorpay" | "stripe" | "cod";
          status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
          amount: number;
          currency?: string;
          provider_payment_id?: string | null;
          provider_order_id?: string | null;
          provider_signature?: string | null;
          provider_data?: Json;
        };
        Update: {
          status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
          provider_payment_id?: string | null;
          provider_order_id?: string | null;
          provider_signature?: string | null;
          provider_data?: Json;
          paid_at?: string | null;
          refunded_at?: string | null;
        };
      };
      collection_products: {
        Row: {
          id: string;
          collection_id: string;
          product_id: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          collection_id: string;
          product_id: string;
          sort_order?: number;
        };
        Update: {
          sort_order?: number;
        };
      };
      coupon_usage: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          order_id: string | null;
          used_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          user_id: string;
          order_id?: string | null;
        };
        Update: Record<string, never>;
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
          note?: string | null;
          changed_by?: string | null;
        };
        Update: Record<string, never>;
      };
      custom_bouquet_images: {
        Row: {
          id: string;
          request_id: string;
          url: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          url: string;
          type?: string;
        };
        Update: Record<string, never>;
      };
      admin_activity_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json;
        };
        Update: Record<string, never>;
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: string;
          old_data: Json | null;
          new_data: Json | null;
          performed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          record_id: string;
          action: string;
          old_data?: Json | null;
          new_data?: Json | null;
          performed_by?: string | null;
        };
        Update: Record<string, never>;
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "customer" | "admin";
      product_status: "draft" | "active" | "hidden" | "archived";
      product_type: "single_flower" | "mini_bouquet" | "premium_bouquet" | "luxury_bouquet" | "custom_bouquet" | "gift_bundle";
      order_status: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded";
      payment_status: "pending" | "authorized" | "captured" | "failed" | "refunded";
      payment_method: "razorpay" | "stripe" | "cod";
      discount_type: "percentage" | "fixed";
      custom_request_status: "pending" | "reviewed" | "approved" | "rejected" | "priced" | "converted" | "in_production" | "completed";
      notification_type: "order_update" | "custom_bouquet" | "promotion" | "system";
    };
  };
};
