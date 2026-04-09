Anthropic just published how they architect managed agents — decoupling the brain, state, and tools into separate layers that scale independently. It's elegant engineering. But it raises a question nobody's asking yet.

Who builds the tools? And who gets to use them?

Anthropic builds the runtime. The sandbox. The session persistence. All of that is infrastructure. But when a customer says "order my groceries" or "find me a cheaper energy plan" — that requires domain-specific tools that know how to search Woolworths, compare Coles prices, or query an Australian energy retailer. Anthropic isn't building those. The community is expected to, for free.

And here's the catch: to use any of these tools through Claude, the customer needs a paid subscription. Minimum $20/month. A free Claude user gets nothing. No MCP tools, no managed agents, no sandbox.

That's a $20/month gatekeeper between the tool you built and the person who needs it.

For a developer in San Francisco, that's nothing. For a family in Harare comparing grocery prices across OK and Bon Marché, that's a month's mobile data budget. For an emerging market where AI-native commerce could leapfrog traditional e-commerce entirely, it's a wall.

I've been building in this space — an autonomous agent runtime called Gombwe and a set of MCP servers for Australian services. What I've learned:

The tools are the hard part, not the runtime. Searching real products across real stores, comparing real prices, handling real transactions — that's domain work that requires local market knowledge. No AI company in San Francisco is going to build an Australian grocery tool, or a Zimbabwean one.

The runtime is getting commoditised. Anthropic, Google, OpenAI — they'll all offer managed agent hosting. That's infrastructure. The value is in the tools that plug into it, and who has access to them.

Access is the real differentiator. A self-hosted agent can talk over WhatsApp, Telegram, Discord. It can offer a free tier. It can be deployed in any market at any price point. It doesn't need to be locked behind a subscription — it can charge per transaction, earn affiliate commissions from retailers, or run on mobile money in markets where credit cards don't exist.

That's why we're building Gombwe Managed Agents — a multi-tenant platform where anyone can message an AI agent over WhatsApp or Telegram, compare grocery prices, and place an order. No Claude subscription. No app to download. The customer texts "what's the cheapest chicken breast this week?" and gets an answer. They say "order my usual groceries" and it happens. The agent searches, compares, confirms with the customer, and checks out — end to end.

Anthropic's managed agents are excellent infrastructure for enterprise customers with budgets. But if AI agents are going to reshape how people interact with businesses — not just in wealthy markets but everywhere — the tools need to be accessible. The customer shouldn't need a $20/month subscription to compare grocery prices.

The future isn't one company running all the agents. It's open tools, running anywhere, accessible to anyone, in any market, at any price point.

That's what we're building at Agents Formation.

https://agentsform.ai
https://gombwe.com
