#!/usr/bin/env node
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

import { reviewDesign, designReviewSchema } from '../lib/mcp/tools/designReview';
import { generateComponent, componentGeneratorSchema } from '../lib/mcp/tools/componentGenerator';
import { getStyleGuide, styleGuideSchema } from '../lib/mcp/tools/styleGuideReference';
import { allResources, getResource } from '../lib/mcp/resources';
import { allPrompts } from '../lib/mcp/prompts';

const app = express();
app.use(express.json());

// Store active transports
const transports = new Map<string, StreamableHTTPServerTransport>();

function createServer(): McpServer {
  const server = new McpServer({
    name: 'appleui-mcp',
    version: '1.0.0',
  });

  // Register Design Review Tool
  server.tool(
    'review_design',
    'Analyze code or design for Apple HIG compliance and suggest improvements',
    designReviewSchema.shape,
    async (args) => {
      try {
        const input = designReviewSchema.parse(args);
        const result = reviewDesign(input);
        return {
          content: [{ type: 'text' as const, text: formatReviewResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
  );

  // Register Component Generator Tool
  server.tool(
    'generate_component',
    'Generate Apple-styled UI components for React, SwiftUI, Tailwind, or CSS',
    componentGeneratorSchema.shape,
    async (args) => {
      try {
        const input = componentGeneratorSchema.parse(args);
        const result = generateComponent(input);
        return {
          content: [{ type: 'text' as const, text: formatComponentResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
  );

  // Register Style Guide Reference Tool
  server.tool(
    'get_style_guide',
    'Get Apple Human Interface Guidelines for specific design topics',
    styleGuideSchema.shape,
    async (args) => {
      try {
        const input = styleGuideSchema.parse(args);
        const result = getStyleGuide(input);
        return {
          content: [{ type: 'text' as const, text: formatStyleGuideResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
  );

  // Register Resources
  const resourceConfigs = [
    { uri: 'appleui://colors/{category}', desc: 'Apple color tokens' },
    { uri: 'appleui://typography/{platform}', desc: 'Apple typography scale' },
    { uri: 'appleui://spacing', desc: 'Apple spacing system' },
    { uri: 'appleui://animations', desc: 'Apple animations' },
    { uri: 'appleui://shadows', desc: 'Apple shadows' },
    { uri: 'appleui://materials', desc: 'Apple materials' },
  ];

  for (const { uri, desc } of resourceConfigs) {
    server.resource(uri, desc, async (resourceUri) => {
      const resource = getResource(resourceUri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${resourceUri.href}`);
      }
      return {
        contents: [{ uri: resourceUri.href, mimeType: resource.mimeType, text: resource.getData() }],
      };
    });
  }

  // Register Prompts
  for (const prompt of allPrompts) {
    const argsSchema: Record<string, z.ZodType> = {};
    for (const arg of prompt.arguments) {
      argsSchema[arg.name] = arg.required
        ? z.string().describe(arg.description)
        : z.string().optional().describe(arg.description);
    }

    server.prompt(prompt.name, prompt.description, argsSchema, async (args) => {
      const stringArgs: Record<string, string> = {};
      for (const [key, value] of Object.entries(args)) {
        if (typeof value === 'string') {
          stringArgs[key] = value;
        }
      }
      return {
        messages: [{ role: 'user' as const, content: { type: 'text' as const, text: prompt.getPrompt(stringArgs) } }],
      };
    });
  }

  return server;
}

// Formatting helpers
function formatReviewResult(result: ReturnType<typeof reviewDesign>): string {
  let output = `# Design Review Results\n\n## Overall Score: ${result.overallScore}/100\n\n`;

  if (result.positives.length > 0) {
    output += `## Positive Patterns\n${result.positives.map(p => `- ${p}`).join('\n')}\n\n`;
  }

  if (result.issues.length > 0) {
    output += `## Issues Found (${result.issues.length})\n\n`;
    for (const issue of result.issues) {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
      output += `### ${icon} ${issue.category.toUpperCase()}: ${issue.description}\n`;
      if (issue.currentCode) output += `**Current:** \`${issue.currentCode}\`\n`;
      output += `**Suggested Fix:** ${issue.suggestedFix}\n`;
      if (issue.higReference) output += `*Reference: ${issue.higReference}*\n`;
      output += '\n';
    }
  }

  if (result.recommendations.length > 0) {
    output += `## Recommendations\n${result.recommendations.map(r => `- ${r}`).join('\n')}`;
  }

  return output;
}

function formatComponentResult(result: ReturnType<typeof generateComponent>): string {
  let output = `# Generated Component\n\n## Code\n\`\`\`tsx\n${result.code}\n\`\`\`\n\n`;
  if (result.styles) output += `## Styles\n\`\`\`css\n${result.styles}\n\`\`\`\n\n`;
  output += `## Usage\n\`\`\`tsx\n${result.usage}\n\`\`\`\n\n`;
  output += `## Design Tokens Used\n- **Colors:** ${result.tokens.colors.join(', ') || 'None'}\n`;
  output += `- **Spacing:** ${result.tokens.spacing.join(', ') || 'None'}\n`;
  output += `- **Typography:** ${result.tokens.typography.join(', ') || 'None'}\n\n`;
  if (result.notes.length > 0) output += `## Notes\n${result.notes.map(n => `- ${n}`).join('\n')}`;
  return output;
}

function formatStyleGuideResult(result: ReturnType<typeof getStyleGuide>): string {
  let output = `# ${result.topic} - Apple Design Guidelines\n\n`;
  output += `## Core Principles\n${result.principles.map(p => `- ${p}`).join('\n')}\n\n`;

  for (const g of result.guidelines) {
    output += `## ${g.title}\n${g.description}\n\n### Do\n${g.do.map(d => `- ${d}`).join('\n')}\n\n### Don't\n${g.dont.map(d => `- ${d}`).join('\n')}\n\n`;
  }

  if (result.codeExamples?.length) {
    output += `## Code Examples\n\n`;
    for (const ex of result.codeExamples) {
      output += `### ${ex.platform}\n${ex.description}\n\`\`\`\n${ex.code}\n\`\`\`\n\n`;
    }
  }

  output += `## HIG References\n${result.higReferences.map(r => `- ${r}`).join('\n')}`;
  return output;
}

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// MCP endpoint
app.all('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (req.method === 'GET') {
    // SSE endpoint
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!sessionId || !transports.has(sessionId)) {
      res.write('event: error\ndata: No session\n\n');
      return res.end();
    }

    req.on('close', () => {
      transports.delete(sessionId);
    });
  } else if (req.method === 'POST') {
    try {
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports.has(sessionId)) {
        transport = transports.get(sessionId)!;
      } else {
        const server = createServer();
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => crypto.randomUUID(),
          onsessioninitialized: (id) => {
            transports.set(id, transport);
          },
        });
        await server.connect(transport);
      }

      const response = await transport.handleRequest(req, res, req.body);
      if (!res.headersSent) {
        res.json(response);
      }
    } catch (error) {
      console.error('MCP Error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: error instanceof Error ? error.message : 'Internal error' },
          id: null,
        });
      }
    }
  } else if (req.method === 'DELETE') {
    if (sessionId && transports.has(sessionId)) {
      transports.delete(sessionId);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Session not found' });
  } else {
    res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'appleui-mcp', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Apple UI MCP Server running on http://localhost:${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log('Available tools: review_design, generate_component, get_style_guide');
});
