/**
 * Coles Australia provider.
 *
 * Uses the Coles public product API for search and details.
 * Coles product data is fetched from their search API endpoint.
 */
const BASE_URL = 'https://www.coles.com.au';
const HEADERS = {
    'Accept': 'application/json',
    'User-Agent': 'au-grocery-mcp/0.1.0',
};
export async function searchProducts(query, limit = 10) {
    // Coles search API endpoint
    const url = `${BASE_URL}/api/products/v2/search?query=${encodeURIComponent(query)}&page=1&pageSize=${limit}`;
    try {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) {
            // Fallback: try the catalog search endpoint
            return await searchProductsFallback(query, limit);
        }
        const data = await res.json();
        const products = [];
        const results = data.results || data.products || data.items || [];
        for (const p of results) {
            products.push({
                name: p.name || p.title || p.displayName || '',
                price: p.price || p.retailPrice || null,
                unit: p.size || p.packageSize || '',
                productId: String(p.id || p.productId || ''),
                url: p.url ? `${BASE_URL}${p.url}` : `${BASE_URL}/product/${p.id || p.productId}`,
                store: 'coles',
                available: p.available !== false,
                brand: p.brand || null,
            });
        }
        return products.slice(0, limit);
    }
    catch {
        return await searchProductsFallback(query, limit);
    }
}
async function searchProductsFallback(query, limit) {
    // Fallback: use the browse/search page API
    const url = `${BASE_URL}/api/browse/search?q=${encodeURIComponent(query)}&page=1&ps=${limit}`;
    try {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok)
            return [];
        const data = await res.json();
        const products = [];
        const results = data.pageProps?.searchResults?.results || data.results || [];
        for (const p of results) {
            const pricing = p.pricing || {};
            products.push({
                name: p.name || p.title || '',
                price: pricing.now || pricing.price || p.price || null,
                unit: p.size || '',
                productId: String(p.id || ''),
                url: `${BASE_URL}/product/${p.id}`,
                store: 'coles',
                available: true,
                brand: p.brand || null,
            });
        }
        return products.slice(0, limit);
    }
    catch {
        return [];
    }
}
