import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

import { Product } from '@/types';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url?: string;
  quantity: number;
  stock_quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Computed values
  totalItems: () => number;
  totalPrice: () => number;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + quantity;
          
          if (newQuantity > product.stock_quantity) {
            toast.error(`Cannot add more items. Only ${product.stock_quantity} available.`);
            return;
          }

          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          
          toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
        } else {
          // Add new item
          if (quantity > product.stock_quantity) {
            toast.error(`Cannot add ${quantity} items. Only ${product.stock_quantity} available.`);
            return;
          }

          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image_url: product.image_url,
            quantity,
            stock_quantity: product.stock_quantity,
          };

          set({
            items: [...items, newItem],
          });
          
          toast.success(`Added ${product.name} to cart`);
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        
        set({
          items: items.filter(item => item.id !== productId),
        });
        
        if (item) {
          toast.success(`Removed ${item.name} from cart`);
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const item = items.find(item => item.id === productId);
        
        if (!item) return;

        if (quantity > item.stock_quantity) {
          toast.error(`Cannot add more items. Only ${item.stock_quantity} available.`);
          return;
        }

        set({
          items: items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
); 