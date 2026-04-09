/**
 * Coles Australia provider.
 *
 * Uses the Coles public product API for search and details.
 * Coles product data is fetched from their search API endpoint.
 */
export interface Product {
    name: string;
    price: number | null;
    unit: string;
    productId: string;
    url: string;
    store: 'coles';
    available: boolean;
    brand: string | null;
}
export declare function searchProducts(query: string, limit?: number): Promise<Product[]>;
