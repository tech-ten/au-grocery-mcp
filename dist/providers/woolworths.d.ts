/**
 * Woolworths Australia provider.
 *
 * Uses the public Woolworths UI API to search products, get details,
 * and check prices. No authentication required for read operations.
 */
export interface Product {
    name: string;
    price: number | null;
    unit: string;
    stockcode: string;
    url: string;
    store: 'woolworths';
    available: boolean;
}
export interface ProductDetail {
    name: string;
    description: string;
    price: number | null;
    wasPrice: number | null;
    unit: string;
    stockcode: string;
    barcode: string | null;
    brand: string | null;
    category: string | null;
    imageUrl: string | null;
    url: string;
    inStock: boolean;
    ingredients: string | null;
    nutritionInfo: string | null;
}
export declare function searchProducts(query: string, limit?: number): Promise<Product[]>;
export declare function getProductDetail(stockcode: string): Promise<ProductDetail | null>;
export declare function getCategories(): Promise<Array<{
    id: string;
    name: string;
}>>;
