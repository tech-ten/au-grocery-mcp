# ADR-004: Anthropic managed agents and what it means for us

**Status**: Active analysis
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

Anthropic published [Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents) describing their hosted agent architecture. They also launched Claude Managed Agents (public beta, April 2026) and the Claude Marketplace. This ADR analyses what these moves mean for our MCP server business.

## What Anthropic built

### Managed agents architecture

Three decoupled components:

1. **Session (state)** — durable append-only event log, queryable, persists across crashes
2. **Harness (brain)** — stateless inference loop calling Claude and routing tool calls, rebootable via `wake(sessionId)`
3. **Sandbox (hands)** — execution environments exposed as tools via `execute(name, input) → string`, provisioned on-demand

MCP servers are the "hands" in this model. They are generic tool interfaces that the harness calls without knowing or caring what's behind them.

### Managed agents pricing

- **$0.08 per runtime hour** for managed agent compute
- Plus standard Claude API token costs
- An agent running 24/7 costs ~$58/month for runtime alone, before tokens

### Claude Marketplace

- Partners (GitLab, Harvey, Replit, Snowflake, etc.) list apps
- **Zero commission** — Anthropic takes no cut on partner sales
- Anthropic makes money through **token consumption** — every app execution burns Claude tokens
- Partner purchases count against existing Anthropic contracts

## How Anthropic monetises tools

**Anthropic does not pay tool providers.** The economics:

```
Customer pays Anthropic  →  Anthropic runs Claude  →  Claude calls MCP tools  →  Tool providers get nothing
         $$$                     keeps $$$                  routes calls               $0
```

Revenue comes from:
- **Token consumption**: Every tool call requires Claude to think (input/output tokens). Anthropic charges for this.
- **Runtime hours**: Managed agent sandbox time at $0.08/hr
- **Server-side tools**: Some built-in tools have extra charges (web search: $10/1k searches)

MCP server creators are not compensated. The MCP partners page invites developers to submit servers for the directory with no mention of payment, revenue sharing, or compensation.

## What this means for us

### The bad news

1. **No revenue share exists.** Anthropic treats MCP servers like open-source libraries — free inputs to their paid platform. Building MCP servers for Anthropic's ecosystem alone generates zero direct revenue.

2. **Anthropic controls the customer relationship.** The customer pays Anthropic, uses Claude, and Claude calls our tools. We never touch the customer. We can't upsell, can't bill, can't even know who's using our server.

3. **Anthropic actively blocks third-party monetisation.** They discontinued OpenClaw's ability to use Claude subscription credits, forcing $1000-5000/day API billing for agentic workloads. Message: don't try to build a cheaper Claude wrapper.

### The good news

1. **Anthropic can't write every tool.** They need the community to build domain-specific MCP servers. Australian grocery, Australian flights, Australian energy — Anthropic will never build these. Someone has to, and being first matters.

2. **MCP is an open standard now.** Donated to the Linux Foundation's Agentic AI Foundation (Dec 2025). Google, AWS, Microsoft, OpenAI, Block all contributing. MCP servers aren't locked to Claude — they work with ChatGPT, Gemini, Cursor, and anything MCP-compatible. We're not dependent on Anthropic alone.

3. **The hosted version is our product, not the MCP server.** Anthropic runs managed agents. We can run managed MCP servers. The local open-source version feeds Anthropic's ecosystem for free. The remote hosted version is our own product with our own billing, independent of Anthropic.

4. **Marketplace listing is free marketing.** Being in Claude's MCP directory puts us in front of every Claude user who searches for Australian grocery tools. Zero customer acquisition cost.

## Strategic implications

### Don't compete with Anthropic on hosting agents

Anthropic runs the brain (Claude) and the runtime (managed agents). We can't compete with that. OpenClaw tried to be a third-party agent harness and got cut off from subscription credits.

### Compete on domain-specific tools

Anthropic builds generic infrastructure. We build Australian-specific tools. They need us more than we need them — without domain tools, managed agents have nothing to execute.

### Revenue comes from three places

1. **Remote MCP hosting (our infrastructure, our billing)**
   - Customer connects to `mcp.agentsform.ai/au-grocery` instead of installing locally
   - We charge per-request or subscription
   - Works with any MCP client (Claude, ChatGPT, Cursor) — not locked to Anthropic
   - This is independent of Anthropic's marketplace

2. **Enterprise integrations (consulting)**
   - Help Woolworths/Coles build their own MCP servers
   - Help airlines, insurers, utilities become agent-callable
   - We're the Australian specialists who already built the reference implementations

3. **Data and marketplace (future)**
   - Aggregate pricing data across retailers
   - Offer businesses paid placement in tool results (with disclosure)
   - Analytics dashboard: "your products were searched 50,000 times by AI agents this month"

### Don't give away the transactional layer

The read-only MCP server (search, compare) can be free and open source — it's marketing. The transactional layer (add to cart, checkout, pay) is where the real value is. That should be remote-only, hosted, and paid. Never open source the buying flow.

## The Android analogy

| Android | MCP ecosystem |
|---------|---------------|
| Google builds Android (OS) | Anthropic builds MCP (protocol) |
| Google runs Play Store | Anthropic runs Claude Marketplace |
| App developers build apps for free | Tool developers build MCP servers for free |
| Google makes money on ads + Play Store cut | Anthropic makes money on tokens + runtime |
| App developers monetise via in-app purchases | Tool developers monetise via... self-hosted remote versions |

The difference: Google takes 15-30% commission but at least there IS a payment mechanism. Anthropic takes 0% because there's no payment to tool providers at all.

## Decision

1. **Publish au-grocery-mcp to Anthropic's MCP directory** — free marketing, zero cost
2. **Keep the local stdio version open source** — feeds the ecosystem, builds credibility
3. **Build the remote hosted version as our own product** — independent billing, not dependent on Anthropic
4. **Never open source the transactional tools** — that's the moat
5. **Position as Australian MCP specialists** — consulting revenue from enterprises wanting to become agent-callable

## References

- [Anthropic: Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents)
- [Claude Marketplace launch](https://www.techzine.eu/news/applications/139359/anthropic-launches-claude-powered-app-marketplace-without-taking-a-cut/)
- [MCP donated to Linux Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- [Anthropic blocks OpenClaw subscription access](https://www.thenextweb.com/news/anthropic-blocks-openclaws-use-with-claude-subscriptions-in-cost-crackdown)
- [ADR-003: Who pays for compute](003-who-pays-for-compute.md)
