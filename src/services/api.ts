import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

import {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
  ChangePasswordFormData,
  Product,
  Category,
  ProductFilters,
  ProductReview,
  ReviewFormData,
} from "@/types";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bdevop.zakhanh.website/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Something went wrong";

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Only show toast if not on login/register pages
      if (!window.location.pathname.includes("/auth/")) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/auth/login";
      }
    } else if (error.response?.status === 403) {
      toast.error(
        "Access denied. You do not have permission to perform this action."
      );
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data.data!;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data.data!;
  },

  getProfile: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>("/auth/profile");
    return response.data.data!;
  },

  updateProfile: async (data: ProfileFormData): Promise<any> => {
    const response = await api.put<ApiResponse<any>>("/auth/profile", data);
    return response.data.data!;
  },

  changePassword: async (data: ChangePasswordFormData): Promise<void> => {
    await api.put<ApiResponse<void>>("/auth/change-password", data);
  },

  logout: async (): Promise<void> => {
    await api.post<ApiResponse<void>>("/auth/logout");
  },
};

// Products API
export const productsAPI = {
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data!;
  },

  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(
      `/products/featured?limit=${limit}`
    );
    return response.data.data!;
  },

  getProductReviews: async (
    slug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ProductReview>> => {
    const response = await api.get<PaginatedResponse<ProductReview>>(
      `/products/${slug}/reviews?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  createReview: async (
    slug: string,
    data: ReviewFormData
  ): Promise<ProductReview> => {
    const response = await api.post<ApiResponse<ProductReview>>(
      `/products/${slug}/reviews`,
      data
    );
    return response.data.data!;
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data.data!;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data.data!;
  },

  getCategoryProducts: async (
    slug: string,
    page: number = 1,
    limit: number = 12
  ): Promise<
    PaginatedResponse<Product> & {
      data: { category: any; products: Product[] };
    }
  > => {
    const response = await api.get<
      PaginatedResponse<Product> & {
        data: { category: any; products: Product[] };
      }
    >(`/categories/${slug}/products?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Cart API (placeholder - will be implemented later)
export const cartAPI = {
  getCart: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>("/cart");
    return response.data.data!;
  },
};

// Orders API (placeholder - will be implemented later)
export const ordersAPI = {
  getOrders: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>("/orders");
    return response.data.data!;
  },
};

// Admin API (placeholder - will be implemented later)
export const adminAPI = {
  getDashboard: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>("/admin/dashboard");
    return response.data.data!;
  },
};

// Export the axios instance for direct use if needed
export default api;
