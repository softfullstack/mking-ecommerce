export interface LogoCustomization {
    id: string;
    imageUrl: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
}

export interface ItemCustomization {
    id: string; // Unique ID for this specific item instance (e.g., "item-1", "item-2")
    name?: string; // Personalization name
    logos: LogoCustomization[];
}

export interface ProductCustomization {
    productId: string | number;
    logos: LogoCustomization[];
    notes?: string;
    customPrice?: number;
}
