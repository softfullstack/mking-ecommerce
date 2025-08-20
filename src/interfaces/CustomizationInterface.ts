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

export interface ProductCustomization {
    productId: string | number;
    logos: LogoCustomization[];
    notes?: string;
    customPrice?: number;
}
