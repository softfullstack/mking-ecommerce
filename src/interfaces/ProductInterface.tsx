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
    rating: number
    reviewCount: number
    reviews: {
        author: string
        rating: number
        date: string
        comment: string
    }[]
    specifications: {
        name: string
        value: string
    }[]
}