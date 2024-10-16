import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart } from "./constants";

interface SidebarState {
	isOpen: boolean;
	toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
	isOpen: false,
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

interface Store {
	cart: Cart[] | null;
	emptyCart: () => void;
	addToCart: (order: Cart) => void;
	removeItem: (id: string) => void;
}

export const useCartStore = create(
	persist<Store>(
		(set) => ({
			cart: null,
			emptyCart: () => set({ cart: null }),
			addToCart: (newOrder) =>
				set((state) => ({
					cart: state.cart ? [...state.cart, newOrder] : [newOrder],
				})),
			removeItem: (id) =>
				set((state) => ({
					cart: state.cart?.filter((item) => item.id !== id),
				})),
		}),
		{
			name: "cart-storage",
		},
	),
);
