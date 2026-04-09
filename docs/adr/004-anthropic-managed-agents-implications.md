# ADR-004: Anthropic managed agents and what it means for us

**Status**: Active analysis
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

Anthropic published [Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents), an engineering blog post describing the internal architecture behind their hosted agent infrastructure (likely powering Claude Code background agents and similar features). This ADR analyses what this architecture means for our MCP server business.

## What Anthropic built

### Managed agents architecture

Three decoupled components:

1. **Session (state)** — durable append-only event log, queryable, persists across crashes
2. **Harness (brain)** — stateless inference loop calling Claude and routing tool calls, rebootable via `wake(sessionId)`
3. **Sandbox (hands)** — execution environments exposed as tools via `execute(name, input) → string`, provisioned on-demand

MCP servers are the "hands" in this model. They are generic tool interfaces that the harness calls without knowing or caring what's behind them.

### Managed agents pricing

For Claude subscribers (Pro, Max, Team, Enterprise), sandbox compute is included in the subscription. For API users, sandbox compute is billed at $0.08/hr plus token costs. What remains unclear is the billing model when an enterprise builds a managed agent product and exposes it to their own end users: does the enterprise absorb all session costs, or is there a pass-through billing mechanism? This has not been addressed publicly.

### Claude Marketplace

- Partners (GitLab, Harvey, Replit, Snowflake, etc.) list apps
- **Zero commission** — Anthropic takes no cut on partner sales
- Anthropic makes money through **token consumption** — every app execution burns Claude tokens
- Partner purchases count against existing Anthropic contracts

## How Anthropic monetises tools

**Anthropic does not pay tool providers.** The economics:

```
Customer subscribes to Claude  →  Anthropic runs Claude + sandbox  →  Claude calls MCP tools  →  Tool providers get nothing
      (subscription)                 (absorbs infra cost)                 (routes calls)               ($0)
```

Revenue comes from:
- **Subscriptions**: Pro, Max, Team, Enterprise plans. Sandbox compute is bundled — customers don't pay extra for managed agent runtime.
- **Token consumption**: API customers pay per-token. Every tool call requires Claude to think (input/output tokens).
- **Server-side tools**: Some built-in tools have extra charges (e.g. web search).

MCP server creators are not compensated. The MCP partners page invites developers to submit servers for the directory with no mention of payment, revenue sharing, or compensation.

## What this means for us

### The bad news

1. **No revenue share exists.** Anthropic treats MCP servers like open-source libraries — free inputs to their paid platform. Building MCP servers for Anthropic's ecosystem alone generates zero direct revenue.

2. **Anthropic controls the customer relationship.** The customer pays Anthropic, uses Claude, and Claude calls our tools. We never touch the customer. We can't upsell, can't bill, can't even know who's using our server.

3. **Anthropic actively blocks third-party monetisation.** They discontinued OpenClaw's ability to use Claude subscription credits, forcing $1000-5000/day API billing for agentic workloads. Message: don't try to build a cheaper Claude wrapper.

4. **$20/month paywall on every user.** Managed agents and MCP tools are only available to paying Claude subscribers (Pro/Max/Team/Enterprise). Free Claude users cannot use them at all. This means a customer who just wants to compare grocery prices must first pay Anthropic $20/month for a subscription before they can access our free tool. That's a gatekeeper tax — especially significant for price-sensitive markets like Africa where $20/month is a real barrier.

### The good news

1. **Anthropic can't write every tool.** They need the community to build domain-specific MCP servers. Australian grocery, Australian flights, Australian energy — Anthropic will never build these. Someone has to, and being first matters.

2. **MCP is an open standard now.** Donated to the Linux Foundation's Agentic AI Foundation (Dec 2025). Google, AWS, Microsoft, OpenAI, Block all contributing. MCP servers aren't locked to Claude — they work with ChatGPT, Gemini, Cursor, and anything MCP-compatible. We're not dependent on Anthropic alone.

3. **The hosted version is our product, not the MCP server.** Anthropic runs managed agents. We can run managed MCP servers. The local open-source version feeds Anthropic's ecosystem for free. The remote hosted version is our own product with our own billing, independent of Anthropic.

4. **Marketplace listing is free marketing.** Being in Claude's MCP directory puts us in front of every Claude user who searches for Australian grocery tools. Zero customer acquisition cost.

## Strategic implications

### Managed agents vs self-hosted: the full comparison

| | Anthropic managed agents | Self-hosted (Gombwe / our remote MCP) |
|---|---|---|
| **Customer cost** | $20/month minimum (Claude subscription) | Free tier possible, or pay-per-use |
| **Access** | Paid Claude subscribers only | Anyone — no subscription required |
| **Free users** | Cannot use MCP tools at all | Can use freely |
| **Model** | Claude only | Any model (Claude, GPT, Gemini, open source) |
| **Data location** | US servers (Anthropic infrastructure) | Your choice — AU servers, edge, on-device |
| **Data sovereignty** | No control — data processed by Anthropic in US | Full control — host where compliance requires |
| **Vendor lock-in** | Locked to Anthropic/Claude | Model-agnostic, portable |
| **Tool availability** | Anthropic decides what's listed/allowed | You decide |
| **Uptime** | Dependent on Anthropic | Dependent on your infrastructure |
| **Customer relationship** | Anthropic owns it — you never see the user | Direct — you know your customers |
| **Revenue to tool provider** | $0 | You set your own pricing |
| **African/emerging markets** | $20/month paywall excludes most users | Accessible at any price point |
| **Customisation** | Limited to what Anthropic's sandbox supports | Full control over runtime, tools, channels |
| **Transactional tools** | Subject to Anthropic's policies | Your policies |

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
| Google makes money on ads + Play Store cut | Anthropic makes money on subscriptions + API tokens |
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
