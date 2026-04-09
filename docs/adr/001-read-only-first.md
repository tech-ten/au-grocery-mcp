# ADR-001: Read-only first

**Status**: Accepted
**Date**: 2026-04-10
**Author**: Tendai Mudavanhu

## Context

We're building an MCP server for Australian grocery shopping. The immediate question is scope: should v0.1 include transactional tools (add to cart, checkout, pay) or only read tools (search, compare, detail)?

Gombwe, our agent runtime, already handles the full buying flow using Playwright browser automation. We could wrap that in MCP tools and ship it.

## Decision

**v0.1 is read-only.** Search, compare, detail, categories. No cart, no checkout, no payment.

## Reasoning

### 1. No auth standard is adopted yet

MCP specifies OAuth 2.1 for remote HTTP servers, but:
- No Australian retailer exposes an OAuth-enabled API for shopping
- Credential delegation (customer gives us their login) is a security and trust problem we don't want in an open-source v0.1
- Browser session forwarding (Playwright) is fragile and probably violates retailer ToS

Shipping transactional tools without a proper auth story means either: asking users to paste their Woolworths password into a config file (bad), or bundling Playwright and a browser binary in an npm package (impractical).

### 2. No payment delegation standard exists

There's no MCP-level pattern for "this agent is authorised to spend $X on my behalf." We'd have to invent one. Inventing payment standards in a v0.1 of a grocery search tool is scope creep.

### 3. No transaction confirmation protocol in MCP

MCP has tools and prompts, but no formal two-phase commit. Gombwe implements its own (agent proposes cart → user confirms via Discord/Telegram → agent completes checkout). Encoding this as MCP tools requires either:
- A `confirm_checkout` tool that blocks until the user responds (how? MCP tools are request/response)
- A polling pattern (`get_pending_confirmation` → `confirm_order`) that's awkward
- An MCP protocol extension for confirmations that doesn't exist yet

### 4. Read-only is independently useful

A search and compare server is valuable on its own. Users can ask their AI assistant "what's the cheapest chicken breast right now?" without needing us to handle their money. This is a complete product, not a stub.

### 5. Read-only is safe to open source

No credentials, no payment, no browser automation, no ToS risk. MIT license, publish to npm, anyone can use it. The transactional layer can be a separate, authenticated, hosted product.

## Consequences

- v0.1 ships fast with four tools, zero auth, zero risk
- Users who want buying need Gombwe (our agent runtime) or their own automation
- The transactional layer becomes Phase 3 (see ROADMAP.md), likely as a remote hosted server with proper auth
- We need to be clear in the README that this server doesn't buy anything, to avoid confusion

## What changes this decision

- A major retailer launches an OAuth-enabled API or MCP server (then we integrate directly)
- MCP spec adds a transaction confirmation protocol (then we implement it)
- We build a trusted auth proxy that handles credential management securely (Phase 2/3 work)
