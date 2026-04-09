/**
 * Woolworths Australia provider.
 *
 * Uses the public Woolworths UI API to search products, get details,
 * and check prices. No authentication required for read operations.
 */
const BASE_URL = 'https://www.woolworths.com.au';
const API_BASE = `${BASE_URL}/apis/ui`;
const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'au-grocery-mcp/0.1.0',
};
export async function searchProducts(query, limit = 10) {
    const url = `${API_BASE}/Search/products?searchTerm=${encodeURIComponent(query)}&pageSize=${limit}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
        throw new Error(`Woolworths search failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const products = [];
    if (data.Products) {
        for (const group of data.Products) {
            for (const p of (group.Products || [group])) {
                if (!p.Stockcode)
                    continue;
                products.push({
                    name: p.DisplayName || p.Name,
                    price: p.Price || p.InstorePrice || null,
                    unit: p.PackageSize || '',
                    stockcode: String(p.Stockcode),
                    url: `${BASE_URL}/shop/productdetails/${p.Stockcode}`,
                    store: 'woolworths',
                    available: p.IsAvailable !== false,
                });
            }
        }
    }
    return products.slice(0, limit);
}
export async function getProductDetail(stockcode) {
    const url = `${API_BASE}/product/detail/${stockcode}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok)
        return null;
    const p = await res.json();
    return {
        name: p.DisplayName || p.Name || '',
        description: p.Description || p.ShortDescription || '',
        price: p.Price || p.InstorePrice || null,
        wasPrice: p.WasPrice || null,
        unit: p.PackageSize || '',
        stockcode: String(p.Stockcode),
        barcode: p.Barcode || null,
        brand: p.Brand || null,
        category: p.Category || null,
        imageUrl: p.LargeImageFile || p.MediumImageFile || null,
        url: `${BASE_URL}/shop/productdetails/${p.Stockcode}`,
        inStock: p.IsAvailable !== false,
        ingredients: p.Ingredients || null,
        nutritionInfo: p.NutritionInfo ? JSON.stringify(p.NutritionInfo) : null,
    };
}
export async function getCategories() {
    const url = `${API_BASE}/PiesCategoriesWithSpecials`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
        throw new Error(`Woolworths categories failed: ${res.status}`);
    }
    const data = await res.json();
    const categories = [];
    if (data.Categories) {
        for (const cat of data.Categories) {
            categories.push({
                id: cat.NodeId || cat.Id || '',
                name: cat.Description || cat.Name || '',
            });
        }
    }
    return categories;
}
