export interface Product {
    id: number
    name: string
    price: number
    description: string
    images: {
        id?: number
        image_path?: string
        url?: string
    }[]
    colorIds: string[]
    colors: string[]
    sizes: string[]
    categories: string[]
    isNew: boolean
    rating?: number
    reviewCount?: number
    discount?: number
    reviews?: {
        author?: string
        rating?: number
        date?: string
        comment?: string
    }[]
    specifications?: {
        name?: string
        value?: string
    }[]
}