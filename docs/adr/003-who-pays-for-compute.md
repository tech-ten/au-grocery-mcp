# ADR-003: Who pays for MCP server compute

**Status**: Open question
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

Anthropic published their [managed agents architecture](https://www.anthropic.com/engineering/managed-agents) describing a three-way decoupling: session (state), harness (brain), sandbox (hands). MCP servers are the "hands" — execution environments exposed as tools via a generic `execute(name, input) → string` interface.

In Anthropic's managed agents, they provision and pay for sandbox compute as part of their service. But in the open MCP ecosystem, MCP server providers (us) run our own infrastructure. The AI platform doesn't pay for it. The question is: who does?

## The cost stack

```
Customer  →  AI Platform  →  MCP Server  →  External APIs
(pays)       (charges)       (costs us)     (free for now)
```

- **Customer → AI Platform**: Customer pays Anthropic/OpenAI via API key or subscription. This covers inference (Claude thinking) and the MCP client.
- **AI Platform → MCP Server**: The platform calls our server but doesn't pay us. It just routes the tool call.
- **MCP Server → External APIs**: We call Woolworths/Coles public APIs. Free for now, but retailers could block or rate-limit us at any time.
- **Our cost**: Server compute, bandwidth, caching, monitoring, support.

## Revenue models

### 1. Customer pays (SaaS) — most likely near-term

The customer pays us directly for access to the hosted remote MCP server.

- API key with usage-based pricing (e.g. $0.01/request, or $5/month flat)
- Free tier for discovery (100 requests/day)
- Paid tiers for higher limits, priority, SLA
- Precedent: every API SaaS business ever

**Pros**: Simple, proven, aligns cost with usage.
**Cons**: Friction — customer needs another account, another API key. Competes with "just install locally for free."

### 2. Business pays (marketplace)

Retailers pay to be listed, prioritised, or featured in the MCP server.

- Woolworths pays for their products to appear first in search results
- Sponsored product placements in `compare_prices` results
- Premium listings with richer data (nutrition, reviews, etc.)
- Precedent: Google Shopping, affiliate marketing

**Pros**: Customer gets free access. Retailers get agent-channel distribution.
**Cons**: Conflicts with user trust ("is this the cheapest, or did they pay to be first?"). Needs scale to attract retailer spend. Regulatory risk (undisclosed advertising).

### 3. AI platform pays (revenue share)

The AI platform (Anthropic, OpenAI) pays MCP server providers a share of revenue when their tools are used.

- Like an app store: 70/30 split on tool usage
- Platform curates and promotes quality tools
- Precedent: Apple App Store, Shopify App Store

**Pros**: Frictionless for customers. Aligns platform and tool provider incentives.
**Cons**: Doesn't exist yet. No MCP platform has announced a revenue share model. May never happen. Can't build a business on something that doesn't exist.

### 4. Freemium (open source + hosted)

The local stdio version is free forever (MIT license). The hosted remote version is paid.

- Free: `npm install -g au-grocery-mcp` — runs on your machine, no cost to us
- Paid: `mcp.agentsform.ai/au-grocery` — runs on our infrastructure, we charge

**Pros**: Open source builds trust and adoption. Hosted version captures revenue from users who want zero-install convenience.
**Cons**: Most users may never upgrade. Need enough scale for the conversion to matter.

## Decision

**Start with freemium (model 4) and SaaS (model 1) combined.**

- Free local version drives adoption and credibility
- Hosted version charges per-request or monthly subscription
- Business/marketplace model (2) is a future possibility once we have volume
- AI platform revenue share (3) is speculative — don't plan around it

## Relationship to Anthropic's managed agents

Anthropic's architecture validates the pattern: tools are generic, sandboxes are provisioned on-demand, the harness is agnostic about what it's calling. Our MCP servers fit this architecture as pluggable "hands."

The key difference: in Anthropic's system, they own the full stack and subsidise sandbox compute as part of their service pricing. In the open ecosystem, tool providers (us) bear their own infrastructure costs and need independent revenue.

This means the hosted MCP server isn't just a convenience feature — it's the only way to build a sustainable business. The free local version is marketing. The hosted version is the product.

## What changes this

- Anthropic or another platform launches an MCP tool marketplace with revenue sharing
- A retailer approaches us for a commercial partnership (paid integration)
- Usage data from the free version reveals a clear conversion path to paid
- Public APIs get blocked and we need to negotiate formal API access (cost goes up)

## Reference

- [Anthropic: Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents)
- [ADR-002: Registry and remote hosting](002-registry-and-remote-hosting.md)
- [ROADMAP.md](../ROADMAP.md) — Phase 2 (remote hosting)
