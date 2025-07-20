export interface ApiImage {
    id: number
    image_path: string
    url: string | null
    product_id: number
    is_primary: boolean
}

export interface ApiCategory {
    id: number
    name: string
}

export interface ApiColor {
    id: number
    name: string
    hex_code?: string
    hex_code_1?: string | null
}

export interface ApiProduct {
    id: number
    name: string
    description: string
    sku: string
    price: string
    img_product: string | null
    category_id: number
    warehouse_id: number | null
    color_id: number
    status: number
    created_at: string
    updated_at: string
    category: ApiCategory
    images: ApiImage[]
    colors: ApiColor[]
}

export interface Product {
    id: number
    name: string
    price: number
    discount: number
    description: string
    details: string
    images: ApiImage[]
    colors: string[]
    colorIds: number[]
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

export function transformApiProduct(apiProduct: ApiProduct): Product {
    // Transformar colores usando la nueva estructura con hex_code y hex_code_1
    const transformedColors: string[] = [];
    apiProduct.colors.forEach(color => {
        if (color.hex_code) {
            transformedColors.push(color.hex_code);
            // Si hay un segundo color, agregarlo también
            if (color.hex_code_1 && color.hex_code_1 !== null) {
                transformedColors.push(color.hex_code_1);
            }
        }
    });

    return {
        id: apiProduct.id,
        name: apiProduct.name,
        price: parseFloat(apiProduct.price),
        discount: 0,
        description: apiProduct.description,
        details: apiProduct.description, // Usando la misma descripción para details
        images: apiProduct.images,
        colors: transformedColors,
        colorIds: apiProduct.colors.map(color => color.id),
        sizes: ["s", "m", "l", "xl"], // Tamaños por defecto
        categories: [apiProduct.category.name.toLowerCase()],
        isNew: new Date(apiProduct.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Producto nuevo si tiene menos de 7 días
        rating: 5,
        reviewCount: 0,
        reviews: [],
        specifications: []
    }
}