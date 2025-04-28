import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addToCart: (product, quantity, size, color) => {
                const { items } = get()

                // Check if item already exists with same size and color
                const existingItemIndex = items.findIndex(
                    (item) => item.id === product.id && item.size === size && item.color === color,
                )

                if (existingItemIndex >= 0) {
                    // Update existing item
                    const updatedItems = [...items]
                    updatedItems[existingItemIndex].quantity += quantity

                    set((state) => ({
                        items: updatedItems,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }))
                } else {
                    // Add new item
                    const newItem = {
                        ...product,
                        quantity,
                        size,
                        color,
                    }

                    set((state) => ({
                        items: [...state.items, newItem],
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }))
                }
            },

            removeFromCart: (itemIndex) => {
                const { items } = get()
                const itemToRemove = items[itemIndex]

                set((state) => ({
                    items: state.items.filter((_, index) => index !== itemIndex),
                    totalItems: state.totalItems - itemToRemove.quantity,
                    totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
                }))
            },

            updateQuantity: (itemIndex, newQuantity) => {
                const { items } = get()
                const item = items[itemIndex]
                const quantityDiff = newQuantity - item.quantity

                const updatedItems = [...items]
                updatedItems[itemIndex].quantity = newQuantity

                set((state) => ({
                    items: updatedItems,
                    totalItems: state.totalItems + quantityDiff,
                    totalPrice: state.totalPrice + item.price * quantityDiff,
                }))
            },

            clearCart: () => {
                set({
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                })
            },
        }),
        {
            name: "cart-storage",
        },
    ),
)

export default useCartStore
