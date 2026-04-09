# au-grocery-mcp

An MCP server for Australian grocery shopping. Search products, compare prices, and get details across Woolworths and Coles.

Built by [Agents Formation](https://agentsform.ai) — AI-native skill integrations for Australian businesses.

## What it does

This MCP server gives any AI assistant (Claude, ChatGPT, Gemini, Cursor, etc.) the ability to:

- **Search products** across Woolworths and Coles
- **Compare prices** for a shopping list and find the cheapest basket
- **Get product details** including ingredients, nutrition info, and pricing
- **Browse categories** to discover products

## Install

```bash
npm install -g @agentsformation/au-grocery-mcp
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

## Development

```bash
git clone https://github.com/tech-ten/au-grocery-mcp
cd au-grocery-mcp
npm install
npm run dev
```

## How it works

The server calls publicly available product search APIs at Woolworths and Coles. No authentication is required for product search and pricing — the same APIs that power their websites.

- **Woolworths**: `woolworths.com.au/apis/ui/Search/products` and `woolworths.com.au/apis/ui/product/detail/{stockcode}`
- **Coles**: `coles.com.au/api/products/v2/search` with fallback endpoints

## About Agents Formation

We help Australian organisations expose their services as AI-native skill integrations. This grocery MCP server is one example of what's possible when businesses become callable by AI assistants.

- Website: [agentsform.ai](https://agentsform.ai)
- Product page: [gombwe.com](https://gombwe.com)
- Email: [tendai@agentsform.ai](mailto:tendai@agentsform.ai)

## License

MIT
