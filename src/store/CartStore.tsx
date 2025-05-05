import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define la interfaz para un producto
export interface Product {
    id: number | string
    name: string
    price: number
    // Agrega aquí otras propiedades relevantes de tu producto
}

// Define la interfaz para un item en el carrito
export interface CartItem extends Product {
    quantity: number
    size?: string
    color?: string
}

// Define la interfaz para el estado del carrito
export interface CartStoreState {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    addToCart: (product: Product, quantity: number, size?: string, color?: string) => void
    removeFromCart: (itemIndex: number) => void
    updateQuantity: (itemIndex: number, newQuantity: number) => void
    clearCart: () => void
}

// Define interfaces for the store actions
interface CartActions {
    addToCart: (product: Product, quantity: number, size?: string, color?: string) => void
    removeFromCart: (itemIndex: number) => void
    updateQuantity: (itemIndex: number, newQuantity: number) => void
    clearCart: () => void
}

// Define interface for the store state without actions
interface CartState {
    items: CartItem[]
    totalItems: number
    totalPrice: number
}

// Combine state and actions for the complete store type
type CartStore = CartState & CartActions

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

                    set((state: CartState) => ({
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
                    }

                    set((state: CartState) => ({
                        items: [...state.items, newItem],
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }))
                }
            },

            removeFromCart: (itemIndex: number) => {
                const { items } = get()
                const itemToRemove = items[itemIndex]

                set((state: CartState) => ({
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

                set((state: CartState) => ({
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
