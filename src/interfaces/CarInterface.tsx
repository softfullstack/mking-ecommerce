import { Product } from "./ProductInterface"

interface CartItem extends Product {
    quantity: number
    size: string
    color: string
}
export interface CartStore {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    addToCart: (product: Product, quantity: number, size: string, color: string) => void
    removeFromCart: (itemIndex: number) => void
    updateQuantity: (itemIndex: number, newQuantity: number) => void
    clearCart: () => void
}