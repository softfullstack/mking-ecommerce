import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "../interfaces/ProductInterface"
import { ItemCustomization } from "../interfaces/CustomizationInterface"

interface CartItem extends Product {
    quantity: number
    size?: string
    color?: string
    customizations?: ItemCustomization[]
}

interface CartStore {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    addToCart: (product: Product, quantity: number, size?: string, color?: string) => void
    removeFromCart: (itemIndex: number) => void
    updateQuantity: (itemIndex: number, newQuantity: number) => void
    updateCustomizations: (itemIndex: number, customizations: ItemCustomization[]) => void
    clearCart: () => void
}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addToCart: (product: Product, quantity: number, size?: string, color?: string) => {
                const { items } = get()

                const existingItemIndex = items.findIndex(
                    (item) => item.id === product.id && item.size === size && item.color === color,
                )

                if (existingItemIndex >= 0) {
                    const updatedItems = [...items]
                    updatedItems[existingItemIndex].quantity += quantity

                    set((state: CartStore) => ({
                        items: updatedItems,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }))
                } else {
                    const newItem: CartItem = {
                        ...product,
                        quantity,
                        size,
                        color,
                        customizations: [],
                    }

                    set((state: CartStore) => ({
                        items: [...state.items, newItem],
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }))
                }
            },

            removeFromCart: (itemIndex: number) => {
                const { items } = get()
                const itemToRemove = items[itemIndex]

                set((state: CartStore) => ({
                    items: state.items.filter((_, index) => index !== itemIndex),
                    totalItems: state.totalItems - itemToRemove.quantity,
                    totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
                }))
            },

            updateQuantity: (itemIndex: number, newQuantity: number) => {
                const { items } = get()
                const item = items[itemIndex]
                const quantityDiff = newQuantity - item.quantity

                const updatedItems = [...items]
                updatedItems[itemIndex].quantity = newQuantity

                set((state: CartStore) => ({
                    items: updatedItems,
                    totalItems: state.totalItems + quantityDiff,
                    totalPrice: state.totalPrice + item.price * quantityDiff,
                }))
            },

            updateCustomizations: (itemIndex: number, customizations: ItemCustomization[]) => {
                const { items } = get()
                const updatedItems = [...items]
                updatedItems[itemIndex].customizations = customizations

                set({
                    items: updatedItems,
                })
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
