# au-grocery-mcp

An MCP server for Australian grocery shopping. Search products, compare prices, and get details across Woolworths and Coles.

Built by [Agents Formation](https://agentsform.ai) — AI-native skill integrations for Australian businesses.

> **Read-only server.** Searches and compares products. Does not add to cart, log in, or place orders. See [docs/ROADMAP.md](docs/ROADMAP.md) for the transactional roadmap.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later — download from nodejs.org if you don't have it. This also installs `npm`.

## Install

```bash
npm install -g au-grocery-mcp
```

## Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "au-grocery": {
      "command": "au-grocery-mcp"
    }
  }
}
```

Then ask Claude things like:

- "Search for sourdough bread at Woolworths"
- "Compare prices for milk, eggs, and butter across Woolworths and Coles"
- "What's the cheapest chicken breast available?"

## Usage with Cursor / VS Code

Add to your MCP config:

```json
{
  "au-grocery": {
    "command": "au-grocery-mcp"
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `search_products` | Search for products at Woolworths, Coles, or both |
| `compare_prices` | Compare a list of items across both stores |
| `get_product_detail` | Get full product info from Woolworths (ingredients, nutrition, pricing) |
| `get_categories` | List all Woolworths product categories |

## Examples

### Search products

```
User: "Find organic milk at both stores"

→ search_products({ query: "organic milk", store: "both", limit: 5 })
```

### Compare a shopping list

```
User: "Which store is cheaper for milk, bread, eggs, and chicken?"

→ compare_prices({ items: ["milk 2L", "sliced bread", "free range eggs", "chicken breast"] })
```

Returns price at each store, which is cheapest per item, and total savings.

## How it works

Calls publicly available product search APIs at Woolworths and Coles. No authentication required — same APIs that power their websites.

- **Woolworths**: `woolworths.com.au/apis/ui/Search/products` and `woolworths.com.au/apis/ui/product/detail/{stockcode}`
- **Coles**: `coles.com.au/api/products/v2/search` with fallback endpoints
- **Transport**: stdio (JSON-RPC 2.0 over stdin/stdout)

## Development

```bash
git clone https://github.com/tech-ten/au-grocery-mcp
cd au-grocery-mcp
npm install
npm run dev
```

## Docs

- [ROADMAP.md](docs/ROADMAP.md) — What's next: transactional tools, remote hosting, registry
- [ADR-001: Read-only first](docs/adr/001-read-only-first.md) — Why this server doesn't buy anything yet
- [ADR-002: Registry and remote hosting](docs/adr/002-registry-and-remote-hosting.md) — Local vs remote MCP, the business model

## MCP Registry

Listed in the [Australian MCP Registry](https://agentsform.ai/registry.html) — JSON API at [`agentsform.ai/api/registry.json`](https://agentsform.ai/api/registry.json)

## About Agents Formation

- Website: [agentsform.ai](https://agentsform.ai)
- Product: [gombwe.com](https://gombwe.com)
- MCP Registry: [agentsform.ai/registry.html](https://agentsform.ai/registry.html)
- Email: [tendai@agentsform.ai](mailto:tendai@agentsform.ai)

## License

MIT
