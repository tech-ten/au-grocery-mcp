# ADR-002: Registry and remote hosting

**Status**: Accepted
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

We have two related infrastructure decisions:

1. **Registry**: How do MCP clients discover our servers? Where is the catalogue?
2. **Remote hosting**: Should we host the MCP server ourselves so clients connect via URL instead of installing locally?

These are different things that are often confused. A registry is a catalogue (like npm). Remote hosting is running the server (like a SaaS API).

## Decision

### Registry

We run our own Australian MCP Registry at `agentsform.ai/api/registry.json`.

- Static JSON file following the [official MCP server schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json)
- Served from S3 + CloudFront (same infrastructure as the website)
- Human-browsable frontend at `agentsform.ai/registry.html` that renders from the JSON
- Open to third-party submissions — any Australian MCP server can be listed

The registry is not a database or an API server. It's a JSON file. Updates are manual (edit the file, deploy to S3). This is intentional — at our current scale (1 published server, 6 planned), a database is overhead. When we have 50+ servers, we'll add a proper API with search, filtering, and automated submission.

### Remote hosting (planned, not built yet)

The MCP server currently runs locally via stdio transport. Remote hosting would mean:

- Running the server on our infrastructure (AWS)
- Clients connect via HTTP+SSE URL instead of installing npm package
- Auth via API keys (read-only) or OAuth 2.1 (transactional, future)

**This is the business model.** The local stdio server is free and open source. The hosted version charges for API calls and provides:

| Feature | Local (free) | Hosted (paid) |
|---------|-------------|---------------|
| Transport | stdio | HTTP+SSE |
| Install | `npm install -g` | None — URL in config |
| Auth | None | API key / OAuth |
| Caching | None | Edge-cached responses |
| Rate limits | None | Per-key limits |
| Transactional tools | No | Future (Phase 3) |
| SLA | None | Uptime guarantees |
| Analytics | None | Usage dashboard |

## Reasoning

### Why our own registry instead of just listing on mcp.so?

We will list on mcp.so and the official MCP registry too. But having our own gives us:

- **Australian focus**: One place to find all Australian MCP servers, not buried in a global list of 19,000+
- **Control**: We can add fields the official schema doesn't support (Australian-specific metadata, state/territory availability)
- **Brand**: `agentsform.ai/registry` positions us as the authority on Australian MCP infrastructure
- **Machine-readable**: Clients that want to discover Australian services specifically can query our registry

### Why static JSON and not a database?

- 1 server published, 6 planned. A PostgreSQL database for 7 entries is absurd.
- Static JSON on S3 is free, fast (CloudFront edge), and never goes down.
- The official MCP registry uses a database because it catalogues thousands of servers globally. We don't have that problem yet.
- Migration path is clear: when we outgrow static JSON, add a small API (Lambda + DynamoDB or similar) that serves the same schema.

### Why remote hosting as a separate product?

- **Stdio is peer-to-peer**: the AI assistant spawns the server as a subprocess. No network, no auth, no billing. You can't charge for something that runs on the user's machine.
- **HTTP is a service**: the server runs on our infrastructure. We control access, measure usage, enforce limits, and can add features (caching, transactional tools) that stdio can't support.
- **Open source + hosted is a proven model**: same as Sentry, PostHog, GitLab. The code is MIT. The hosted version is the product.

## Architecture

### Current (v0.1)

```
User's machine:
  Claude Desktop  ←stdio→  au-grocery-mcp (subprocess)
                               ↓
                     Woolworths API (public)
                     Coles API (public)
```

### Planned remote hosting

```
User's machine:                    Our infrastructure (AWS):
  Claude Desktop  ←HTTP+SSE→  mcp.agentsform.ai
                                    ↓
                               au-grocery-mcp (ECS/Lambda)
                                    ↓
                               Cache layer (Redis/CloudFront)
                                    ↓
                               Woolworths API
                               Coles API
```

### Planned transactional (Phase 3)

```
User's machine:                    Our infrastructure:              Retailer:
  Claude Desktop  ←HTTP+SSE→  mcp.agentsform.ai  ←OAuth 2.1→  Retailer API
       ↑                           ↓                            (or Playwright
  User confirms                Auth proxy                        if no API)
  via MCP prompt               Payment handling
                               Transaction log
```

## Consequences

- Registry is live now, costs nothing, scales to ~100 servers before we need a real backend
- Remote hosting is a separate workstream with real infrastructure cost — don't build it until we have users for the local version
- The business model depends on the hosted version. The free local server is marketing, not revenue.
- We should submit au-grocery-mcp to the official MCP registry and mcp.so as well, for visibility

## Open questions

- **Pricing**: Per-request? Monthly subscription? Free tier size?
- **Multi-tenancy**: One hosted server instance per customer, or shared?
- **Transactional auth**: OAuth 2.1 with which identity provider? Do we become the IdP?
- **Retailer relationships**: Do we approach Woolworths/Coles about official API access, or keep using public endpoints?
