export interface Product {
    id: number
    name: string
    price: number
    discount: number
    description: string
    details: string
    images: string[]
    colorIds: string[]
    colors: string[]
    sizes: string[]
    categories: string[]
    isNew: boolean
    reviews: { rating: number; comment: string }[]
}