// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  price: number;
  compare_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id?: string;
  image_url?: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  review_count?: number;
  average_rating?: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

// Cart types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_name: string;
  product_price: number;
  product_image_url?: string;
  product_stock: number;
}

// Order types
export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_company?: string;
  shipping_address_line_1: string;
  shipping_address_line_2?: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone?: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_company?: string;
  billing_address_line_1: string;
  billing_address_line_2?: string;
  billing_city: string;
  billing_state?: string;
  billing_postal_code: string;
  billing_country: string;
  billing_phone?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_sku?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Review types
export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ReviewFormData {
  rating: number;
  title?: string;
  comment?: string;
}

// Query types
export interface ProductFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  sort?: 'name' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// UI State types
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
} 