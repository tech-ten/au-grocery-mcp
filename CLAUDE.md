# au-grocery-mcp

Australian grocery MCP server built by Agents Formation.

## What this is

An MCP (Model Context Protocol) server that lets AI assistants search, compare, and get details on grocery products from Woolworths and Coles — Australia's two largest supermarket chains.

## Architecture

```
src/
├── index.ts              # MCP server entry point, tool definitions
├── providers/
│   ├── woolworths.ts     # Woolworths API client (search, detail, categories)
│   └── coles.ts          # Coles API client (search)
└── tools/                # Reserved for future tool modules
```

## Tools exposed

- `search_products` — Search for products at Woolworths, Coles, or both
- `compare_prices` — Compare a list of items across both stores, shows cheapest and savings
- `get_product_detail` — Get full product info (ingredients, nutrition, pricing) from Woolworths
- `get_categories` — List Woolworths product categories

## API details

- **Woolworths**: Uses `woolworths.com.au/apis/ui/` endpoints (Search/products, product/detail, PiesCategoriesWithSpecials). No auth needed for reads.
- **Coles**: Uses `coles.com.au/api/` endpoints. Falls back to browse/search API if primary fails.

## Running

```bash
npm install
npm run build
npm start          # stdio transport (for Claude Desktop, Cursor, etc.)
npm run dev        # development with tsx
```

## Adding to Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "au-grocery": {
      "command": "node",
      "args": ["/path/to/au-grocery-mcp/dist/index.js"]
    }
  }
}
```

## Publishing

```bash
npm run build
npm publish --access public
```

## Part of Agents Formation

This server is part of the Agents Formation ecosystem — building AI-native skill integrations for Australian businesses. See https://agentsform.ai
