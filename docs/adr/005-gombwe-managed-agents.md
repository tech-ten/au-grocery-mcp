# ADR-005: Gombwe Managed Agents — the product

**Status**: Accepted
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

Anthropic published their managed agents architecture (session/harness/sandbox decoupling) and offers it as a hosted service for Claude subscribers ($20/month minimum). After analysing the implications (ADR-004), we identified a gap: managed agents locked behind a subscription paywall, US-hosted, Claude-only, with no revenue to tool providers.

We have:
- **Gombwe**: a working autonomous agent runtime with multi-channel support (Discord, Telegram, web)
- **au-grocery-mcp**: a working MCP server for Australian grocery search and comparison
- **A buying flow**: Playwright-based checkout for Woolworths and Coles (built into Gombwe)
- **Local market presence**: based in Melbourne, understanding of Australian retail

## Decision

Build **Gombwe Managed Agents** — a multi-tenant agent platform for Australian e-commerce, accessible to anyone over messaging channels, no AI subscription required.

## What this is

A hosted service where customers interact with an AI agent over WhatsApp, Telegram, Discord, or web to:
- Search and compare grocery prices across Woolworths and Coles
- Build a shopping basket optimised for price
- Place orders with confirmation (two-phase: agent proposes → customer confirms)
- Track deliveries
- Manage preferences, dietary needs, recurring orders

Each customer gets their own context — their own preferences, their own order history, their own store accounts. Multi-tenant, not single-household.

## Advantages over Anthropic's managed agents

| | Anthropic managed agents | Gombwe managed agents |
|---|---|---|
| **Access** | Paid Claude subscribers only ($20/month) | Anyone — WhatsApp, Telegram, Discord, web |
| **Cost to customer** | $20/month subscription + whatever the tool charges | Free tier possible, or per-transaction, or low monthly |
| **Data location** | US (Anthropic infrastructure) | AWS Sydney — Australian data stays in Australia |
| **Data sovereignty** | No control | Full compliance with Australian privacy law |
| **Model** | Claude only | Model-agnostic — Claude, GPT, Gemini, Haiku, open source. Use the cheapest model that fits the task. |
| **Channels** | Claude's chat interface | WhatsApp, Telegram, Discord, SMS, web, branded apps |
| **Transactional** | Read-only tools (search, compare) — no buying standard | End-to-end: search → compare → cart → confirm → pay → deliver |
| **Revenue model** | Anthropic keeps everything, tool providers get $0 | Per-transaction fees, affiliate commissions, retailer partnerships |
| **Retailer relationships** | None — Anthropic is in San Francisco | Local — can negotiate API access, affiliates, partnerships in person |
| **Emerging markets** | $20/month paywall excludes most of Africa, SE Asia | Deployable at any price point, over WhatsApp, with mobile money |
| **Customisation** | Limited to Anthropic's sandbox capabilities | Full control over runtime, channels, confirmation flows, scheduling |

## Revenue model

### Near-term
1. **Per-transaction fee** — $1 per grocery order, or 2% of basket value
2. **Affiliate commissions** — earn from retailers when orders are placed through the platform
3. **Free tier** — price comparison is free (drives adoption). Ordering/checkout is paid.

### Medium-term
4. **Retailer partnerships** — Woolworths/Coles pay for preferred placement or API access
5. **Subscription** — $5/month for unlimited orders, priority support, recurring lists
6. **Enterprise** — white-label the platform for retailers who want their own agent channel

### Long-term
7. **Emerging markets** — deploy the same platform for Zimbabwean, Kenyan, Nigerian retailers over WhatsApp with mobile money integration
8. **Multi-vertical** — expand beyond grocery to flights, insurance, energy, vehicle hire

## Architecture

```
Customers:
  WhatsApp  ─┐
  Telegram  ─┤
  Discord   ─┼──→  Gombwe API Gateway  ──→  Agent Harness (stateless)
  Web       ─┤          │                         │
  SMS       ─┘          │                         ├── Session store (per-user state)
                        │                         ├── MCP servers (tools)
                   Auth + billing                 │     ├── au-grocery-mcp
                   User management                │     ├── au-flights-mcp (future)
                                                  │     └── au-energy-mcp (future)
                                                  └── Transaction engine
                                                        ├── Cart management
                                                        ├── Checkout (Playwright / retailer API)
                                                        ├── Payment (Stripe / mobile money)
                                                        └── Confirmation (two-phase)
```

### Key components to build

1. **Multi-tenant user store** — each customer has their own profile, preferences, order history, store credentials
2. **Channel adapters** — WhatsApp Business API, Telegram Bot API, Discord bot (existing), web widget
3. **Session persistence** — durable event log per user (following Anthropic's pattern — this part of their architecture is good)
4. **Auth layer** — user registration, session tokens, credential vault for store logins
5. **Billing** — Stripe for payments, usage tracking, free tier limits
6. **Transaction engine** — cart, checkout, confirmation, order tracking

### What we already have

- Gombwe agent runtime (completion loop, skill execution, multi-channel)
- au-grocery-mcp (search, compare, detail tools)
- Playwright buying flow (Woolworths and Coles checkout)
- Discord and Telegram integration
- Two-phase ordering (confirm before purchase)
- Meal planning and preference management

### What we need to build

- Multi-tenant user management (currently single-household)
- WhatsApp Business API integration
- Session persistence (currently in-memory)
- Billing/payment infrastructure
- Credential vault (currently plaintext config)
- Rate limiting and abuse prevention

## Honest risks

1. **Retailer ToS** — Playwright-based buying may violate Woolworths/Coles terms of service. Mitigated by pursuing formal API partnerships.
2. **Scale** — one person building a multi-tenant platform. Start with grocery only, one channel (Telegram or Discord), 10 beta users.
3. **Model costs** — even Haiku costs money at scale. Per-transaction revenue must exceed per-transaction model cost.
4. **Security** — storing customer store credentials is a liability. Need proper encryption, vault, and clear terms.
5. **Competition** — if this works, Anthropic or a well-funded startup could build the same thing. Speed and local market knowledge are the moat.

## What changes this

- A retailer offers formal API access (removes Playwright dependency)
- Anthropic removes the subscription paywall for MCP tools (reduces our advantage)
- A competitor launches a similar service in Australia first
- Regulation around AI-mediated commerce (could help or hurt)

## References

- [ADR-004: Anthropic managed agents implications](004-anthropic-managed-agents-implications.md)
- [ADR-001: Read-only first](001-read-only-first.md)
- [ROADMAP.md](../ROADMAP.md)
- [Anthropic: Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents)
