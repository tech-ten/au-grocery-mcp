# au-grocery-mcp

Australian grocery MCP server built by Agents Formation.

## What this is

A read-only MCP server that lets AI assistants search, compare, and get details on grocery products from Woolworths and Coles. Does not buy anything — see `docs/adr/001-read-only-first.md` for why.

## Architecture

```
src/
├── index.ts              # MCP server entry point, tool definitions
├── providers/
│   ├── woolworths.ts     # Woolworths API client (search, detail, categories)
│   └── coles.ts          # Coles API client (search)
└── tools/                # Reserved for future tool modules

docs/
├── ROADMAP.md            # Phased plan: read → remote hosting → transactional
└── adr/
    ├── 001-read-only-first.md           # Why no buying in v0.1
    └── 002-registry-and-remote-hosting.md  # Registry vs hosting, business model
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

## Key decisions

- **Read-only**: No cart, checkout, or payment tools. See ADR-001.
- **Stdio transport**: Runs as subprocess, no network server. Remote HTTP hosting is Phase 2.
- **Unscoped npm package**: Published as `au-grocery-mcp` (not `@agentsformation/au-grocery-mcp`) because the npm org doesn't exist yet.

## Registry

Listed in the Australian MCP Registry at `agentsform.ai/api/registry.json`. The registry is a static JSON file on S3, not a database. See ADR-002.

## Publishing

```bash
npm run build
npm publish --access public
```
