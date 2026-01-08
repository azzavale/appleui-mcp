#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log to stderr so it doesn't interfere with MCP communication
  console.error('Apple UI MCP Server running on stdio');
  console.error('Available tools: review_design, generate_component, get_style_guide');
  console.error('Available resources: colors, typography, spacing, animations, shadows, materials');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
