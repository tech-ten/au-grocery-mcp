# Roadmap

## Current state (v0.1.0)

Read-only MCP server. Four tools: search, compare, detail, categories. Stdio transport. Runs locally as a subprocess of the AI assistant. No auth, no network server, no buying.

## Phase 1: Stabilise read layer

- [ ] Response caching (avoid hammering retailer APIs)
- [ ] Rate limiting per provider
- [ ] Error handling for API changes (Coles endpoints change frequently)
- [ ] Add Woolworths category-scoped search
- [ ] Add Coles product detail (currently Woolworths only)
- [ ] Unit tests with mocked API responses
- [ ] Integration tests against live APIs (CI, not on every push)

## Phase 2: Remote hosting (HTTP transport)

Move from local stdio to a hosted HTTP+SSE server that clients connect to via URL instead of installing locally.

**Why**: Stdio requires every user to `npm install -g`. Remote hosting means zero install — add a URL to your MCP config and go. This is also the monetisable layer (see [ADR-002](adr/002-registry-and-remote-hosting.md)).

- [ ] HTTP+SSE transport using `@modelcontextprotocol/sdk` StreamableHTTPServerTransport
- [ ] Deploy to AWS (Lambda + API Gateway, or ECS)
- [ ] API key auth for the hosted version
- [ ] Request logging and usage tracking
- [ ] Rate limiting per API key
- [ ] Response caching at the edge (CloudFront)
- [ ] Pricing model: free tier (100 requests/day) + paid

**Endpoint**: `https://mcp.agentsform.ai/au-grocery` (planned)

**Client config** (zero install):
```json
{
  "mcpServers": {
    "au-grocery": {
      "url": "https://mcp.agentsform.ai/au-grocery",
      "headers": { "Authorization": "Bearer <api-key>" }
    }
  }
}
```

## Phase 3: Transactional tools

Add tools that actually buy things. This is the hard part — see [ADR-001](adr/001-read-only-first.md) for why it's not in v0.1.

### The three unsolved problems

**1. Authentication**
The customer needs to prove their identity to the retailer. Options:
- OAuth 2.1 (MCP spec supports this for remote servers) — requires retailer participation
- Credential delegation (customer gives us their login) — security/trust problem
- Browser session forwarding (Playwright-based, how Gombwe does it today) — fragile, ToS risk

**2. Payment delegation**
How does an agent spend money on the customer's behalf?
- Scoped tokens: "spend up to $200/week on groceries" — no standard exists
- Pre-authorized payment: customer pre-loads a wallet — adds friction
- Retailer-managed: retailer handles payment, agent just confirms — requires retailer MCP server

**3. Transaction confirmation**
Who's liable when the agent buys the wrong thing?
- Two-phase: agent proposes → customer confirms → agent executes (Gombwe does this today)
- MCP has no formal confirmation/commit protocol yet
- Need: a standard `confirm_transaction` tool pattern with timeout and rollback

### Planned transactional tools

| Tool | Description | Auth required |
|------|-------------|---------------|
| `add_to_cart` | Add a product to the customer's cart | Yes |
| `view_cart` | Show current cart contents and total | Yes |
| `remove_from_cart` | Remove item from cart | Yes |
| `checkout` | Initiate checkout (returns confirmation prompt) | Yes |
| `confirm_order` | Confirm and place the order | Yes |
| `cancel_order` | Cancel a pending order | Yes |
| `order_status` | Check delivery status | Yes |

### The end state

Retailers run their own MCP servers (or authorise third parties like us):

```
Customer's AI  →  MCP Client  →  Remote MCP Server  →  Retailer API
                       ↑
                 OAuth 2.1 token
                 Scoped: "groceries, $200/week, delivery to 3000"
```

Until retailers participate, we bridge the gap with browser automation behind a remote MCP server — same as Gombwe, but exposed as standard MCP tools instead of custom shell scripts.

## Phase 4: Multi-retailer expansion

- [ ] au-flights-mcp — Domestic and international flights
- [ ] au-energy-mcp — Electricity and gas plan comparison
- [ ] au-insurance-mcp — Car, home, health insurance quotes
- [ ] au-vehicle-hire-mcp — Car, truck, van rentals
- [ ] au-telco-mcp — Mobile, broadband, NBN plans
- [ ] au-gov-mcp — Government service eligibility and applications

Each follows the same pattern: read-only first, remote hosting second, transactional third.

## Registry

All servers are catalogued in the [Australian MCP Registry](https://agentsform.ai/registry.html).

- JSON API: `agentsform.ai/api/registry.json`
- Schema: follows the [official MCP server schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json)
- Purpose: machine-readable discovery for MCP clients
