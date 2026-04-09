#!/usr/bin/env node

/**
 * au-grocery-mcp — Australian Grocery MCP Server
 *
 * An MCP server that exposes Australian grocery shopping as tools
 * for AI assistants. Search products, compare prices, and get details
 * across Woolworths and Coles.
 *
 * Built by Agents Formation — https://agentsform.ai
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as woolworths from './providers/woolworths.js';
import * as coles from './providers/coles.js';

const server = new McpServer({
  name: 'au-grocery-mcp',
  version: '0.1.0',
});

// ── Tools ────────────────────────────────────────────────

server.tool(
  'search_products',
  'Search for grocery products across Australian supermarkets. Returns product names, prices, and availability.',
  {
    query: z.string().describe('Search term, e.g. "organic milk", "sourdough bread"'),
    store: z.enum(['woolworths', 'coles', 'both']).default('both').describe('Which store to search'),
    limit: z.number().min(1).max(20).default(5).describe('Max results per store'),
  },
  async ({ query, store, limit }) => {
    const results: Array<woolworths.Product | coles.Product> = [];

    if (store === 'woolworths' || store === 'both') {
      try {
        const products = await woolworths.searchProducts(query, limit);
        results.push(...products);
      } catch (e) {
        results.push({ name: `Woolworths search error: ${(e as Error).message}`, price: null, unit: '', stockcode: '', url: '', store: 'woolworths', available: false } as woolworths.Product);
      }
    }

    if (store === 'coles' || store === 'both') {
      try {
        const products = await coles.searchProducts(query, limit);
        results.push(...products);
      } catch (e) {
        results.push({ name: `Coles search error: ${(e as Error).message}`, price: null, unit: '', productId: '', url: '', store: 'coles', available: false, brand: null } as coles.Product);
      }
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(results, null, 2),
      }],
    };
  }
);

server.tool(
  'compare_prices',
  'Compare prices for a list of grocery items across Woolworths and Coles. Returns the cheapest option for each item and the total savings.',
  {
    items: z.array(z.string()).describe('List of items to compare, e.g. ["milk 2L", "bread", "eggs"]'),
  },
  async ({ items }) => {
    const comparisons = [];
    let woolworthsTotal = 0;
    let colesTotal = 0;

    for (const item of items) {
      const [wProducts, cProducts] = await Promise.all([
        woolworths.searchProducts(item, 3).catch(() => []),
        coles.searchProducts(item, 3).catch(() => []),
      ]);

      const w = wProducts[0];
      const c = cProducts[0];
      const wPrice = w?.price ?? null;
      const cPrice = c?.price ?? null;

      let cheapest: string = 'unknown';
      if (wPrice !== null && cPrice !== null) cheapest = wPrice <= cPrice ? 'woolworths' : 'coles';
      else if (wPrice !== null) cheapest = 'woolworths';
      else if (cPrice !== null) cheapest = 'coles';

      if (wPrice !== null) woolworthsTotal += wPrice;
      if (cPrice !== null) colesTotal += cPrice;

      comparisons.push({
        item,
        woolworths: w ? { name: w.name, price: wPrice } : null,
        coles: c ? { name: c.name, price: cPrice } : null,
        cheapest,
        saving: wPrice !== null && cPrice !== null ? Math.abs(wPrice - cPrice).toFixed(2) : null,
      });
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          comparisons,
          totals: {
            woolworths: woolworthsTotal.toFixed(2),
            coles: colesTotal.toFixed(2),
            cheapestOverall: woolworthsTotal <= colesTotal ? 'woolworths' : 'coles',
            saving: Math.abs(woolworthsTotal - colesTotal).toFixed(2),
          },
        }, null, 2),
      }],
    };
  }
);

server.tool(
  'get_product_detail',
  'Get detailed information about a specific Woolworths product including ingredients, nutrition, and pricing.',
  {
    stockcode: z.string().describe('Woolworths product stockcode'),
  },
  async ({ stockcode }) => {
    const detail = await woolworths.getProductDetail(stockcode);

    if (!detail) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ error: `Product ${stockcode} not found` }),
        }],
      };
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(detail, null, 2),
      }],
    };
  }
);

server.tool(
  'get_categories',
  'List all product categories available at Woolworths.',
  {},
  async () => {
    const categories = await woolworths.getCategories();
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(categories, null, 2),
      }],
    };
  }
);

// ── Start ────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
