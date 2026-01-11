import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "../interfaces/ProductInterface"
import { ItemCustomization } from "../interfaces/CustomizationInterface"
import { GetCartService, UpdateCartService, ClearCartService } from "../services/MKing.service"

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
    addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<void>
    removeFromCart: (itemIndex: number) => Promise<void>
    updateQuantity: (itemIndex: number, newQuantity: number) => Promise<void>
    updateCustomizations: (itemIndex: number, customizations: ItemCustomization[]) => Promise<void>
    clearCart: () => Promise<void>
    fetchCart: () => Promise<void>
}

const syncCart = async (items: CartItem[]) => {
    const token = localStorage.getItem("token")
    if (token) {
        try {
            const backendItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                // Si tienes lógica de personalización en el frontend, puedes mapearla aquí
                customName: item.size || null,
                embroideryImage: item.color || null,
            }))
            await UpdateCartService(backendItems)
        } catch (error) {
            console.error("Error syncing cart with backend:", error)
        }
    }
}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addToCart: async (product: Product, quantity: number, size?: string, color?: string) => {
                const { items } = get()

                const existingItemIndex = items.findIndex(
                    (item) => item.id === product.id && item.size === size && item.color === color,
                )

                let newItems = [...items]
                if (existingItemIndex >= 0) {
                    newItems[existingItemIndex].quantity += quantity
                } else {
                    const newItem: CartItem = {
                        ...product,
                        quantity,
                        size,
                        color,
                        customizations: [],
                    }
                    newItems.push(newItem)
                }

                const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0)
                const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

                set({ items: newItems, totalItems, totalPrice })
                await syncCart(newItems)
            },

            removeFromCart: async (itemIndex: number) => {
                const { items } = get()
                const newItems = items.filter((_, index) => index !== itemIndex)

                const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0)
                const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

                set({ items: newItems, totalItems, totalPrice })
                await syncCart(newItems)
            },

            updateQuantity: async (itemIndex: number, newQuantity: number) => {
                const { items } = get()
                const newItems = [...items]
                newItems[itemIndex].quantity = newQuantity

                const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0)
                const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

                set({ items: newItems, totalItems, totalPrice })
                await syncCart(newItems)
            },

            updateCustomizations: async (itemIndex: number, customizations: ItemCustomization[]) => {
                const { items } = get()
                const newItems = [...items]
                newItems[itemIndex].customizations = customizations

                set({ items: newItems })
                await syncCart(newItems)
            },

            clearCart: async () => {
                set({ items: [], totalItems: 0, totalPrice: 0 })
                const token = localStorage.getItem("token")
                if (token) {
                    try {
                        await ClearCartService()
                    } catch (error) {
                        console.error("Error clearing cart in backend:", error)
                    }
                }
            },

            fetchCart: async () => {
                const token = localStorage.getItem("token")
                if (!token) return

                try {
                    const response = await GetCartService()
                    const backendCart = response.data

                    if (backendCart && backendCart.items) {
                        const frontendItems = backendCart.items.map((item: any) => ({
                            ...item.product,
                            quantity: item.quantity,
                            price: parseFloat(item.price),
                            size: item.customName, // Mapeo temporal según lo definido en syncCart
                            color: item.embroideryImage,
                            customizations: [],
                        }))

                        const totalItems = frontendItems.reduce((acc: number, item: any) => acc + item.quantity, 0)
                        const totalPrice = frontendItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)

                        set({ items: frontendItems, totalItems, totalPrice })
                    }
                } catch (error) {
                    console.error("Error fetching cart from backend:", error)
                }
            },
        }),
        {
            name: "cart-storage",
        },
    ),
)

export default useCartStore
