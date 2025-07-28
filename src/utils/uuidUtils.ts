/**
 * Utilidades para manejo de UUIDs
 */

// Regex para validar UUID v4
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valida si una cadena es un UUID válido
 * @param uuid - La cadena a validar
 * @returns true si es un UUID válido, false en caso contrario
 */
export const isValidUuid = (uuid: string): boolean => {
    return UUID_REGEX.test(uuid);
};

/**
 * Genera un UUID v4
 * @returns Un UUID v4 válido
 */
export const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Extrae el UUID de una URL de producto
 * @param url - La URL del producto
 * @returns El UUID extraído o null si no se encuentra
 */
export const extractUuidFromUrl = (url: string): string | null => {
    const match = url.match(/\/producto\/([^\/\?]+)/);
    if (match && isValidUuid(match[1])) {
        return match[1];
    }
    return null;
};

/**
 * Construye una URL de producto usando UUID
 * @param uuid - El UUID del producto
 * @returns La URL completa del producto
 */
export const buildProductUrl = (uuid: string): string => {
    if (!isValidUuid(uuid)) {
        throw new Error('Invalid UUID provided');
    }
    return `/producto/${uuid}`;
};

/**
 * Maneja el fallback de UUID a ID si es necesario
 * @param uuid - El UUID del producto
 * @param id - El ID numérico del producto
 * @returns El UUID si es válido, o el ID como string si no
 */
export const getProductIdentifier = (uuid?: string, id?: number): string => {
    if (uuid && isValidUuid(uuid)) {
        return uuid;
    }
    if (id !== undefined) {
        return id.toString();
    }
    throw new Error('No valid product identifier found');
};

/**
 * Verifica si un producto tiene un UUID válido
 * @param product - El producto a verificar
 * @returns true si tiene UUID válido, false en caso contrario
 */
export const hasValidUuid = (product: { uuid?: string; id?: number }): boolean => {
    return !!(product.uuid && isValidUuid(product.uuid));
};

/**
 * Obtiene el identificador preferido para un producto
 * @param product - El producto
 * @returns El UUID si está disponible y es válido, o el ID como string
 */
export const getPreferredIdentifier = (product: { uuid?: string; id?: number }): string => {
    return getProductIdentifier(product.uuid, product.id);
}; 