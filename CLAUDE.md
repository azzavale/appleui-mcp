# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apple UI MCP is a Model Context Protocol (MCP) server that provides Apple Human Interface Guidelines (HIG) design guidance. It has two parts:
1. **MCP Server** - Provides tools for design review, component generation, and style guide reference
2. **Next.js Web App** - Landing page, dashboard, and Stripe payment integration for subscriptions

## Common Commands

```bash
# Development
npm run dev          # Next.js web app (port 3000)
npm run dev:mcp      # MCP server via stdio
npm run dev:http     # MCP server via HTTP (port 3000)

# Build
npm run build        # Next.js production build
npm run build:mcp    # TypeScript compilation for MCP

# Database (Drizzle + Vercel Postgres)
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations

# Linting
npm run lint         # ESLint
```

## Architecture

### MCP Server (`src/`)

Entry points:
- `src/index.ts` - Stdio transport for CLI tools (Claude Desktop)
- `src/http-server.ts` - HTTP transport with Express for web-based MCP clients
- `src/server.ts` - Core MCP server setup, registers tools/resources/prompts

Three MCP tools:
- `review_design` - Analyzes code for Apple HIG compliance, returns score and issues
- `generate_component` - Generates Apple-styled components (React, SwiftUI, Tailwind, CSS)
- `get_style_guide` - Returns HIG guidelines for specific topics

Tool implementations in `lib/mcp/tools/`:
- `designReview.ts` - Pattern-based code analysis for colors, typography, spacing, accessibility
- `componentGenerator.ts` - Component code generation
- `styleGuideReference.ts` - HIG content retrieval

MCP Resources (`lib/mcp/resources/index.ts`):
- Design tokens exposed via `appleuimcp://` URIs (colors, typography, spacing, animations, shadows, materials)

MCP Prompts (`lib/mcp/prompts/index.ts`):
- `review_component`, `create_design_system`, `accessibility_audit`, `adapt_for_platform`

Design token data in `lib/mcp/mcp-data/` - Apple color palettes, typography scales, spacing system, animations, etc.

### Next.js Web App (`app/`)

- `app/page.tsx` - Landing page with pricing and docs
- `app/dashboard/page.tsx` - User dashboard for API key management
- `app/api/` - API routes for checkout, webhooks, key management

### Database (`lib/db/`)

Drizzle ORM with Vercel Postgres:
- `schema.ts` - Tables: users, subscriptions, apiKeys, usageLogs
- API keys are SHA-256 hashed, stored with prefix for display

### Stripe Integration (`lib/stripe/`)

Handles subscriptions and webhook events for payment processing.

### Auth (`lib/auth/`)

API key validation and authentication utilities.

## Key Patterns

- Path alias `@/*` maps to project root (e.g., `@/lib/mcp/tools`)
- MCP server uses Zod schemas for tool input validation
- Design tokens support both light and dark mode variants
- HTTP server maintains session state for MCP transport with session IDs

## Environment Variables

Required in `.env.local`:
- Stripe keys (public/secret)
- Database connection (Vercel Postgres)
- API-related secrets
