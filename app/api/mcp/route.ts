import { NextRequest, NextResponse } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

import { reviewDesign, designReviewSchema } from '@/lib/mcp/tools/designReview';
import { generateComponent, componentGeneratorSchema } from '@/lib/mcp/tools/componentGenerator';
import { getStyleGuide, styleGuideSchema } from '@/lib/mcp/tools/styleGuideReference';
import { allResources, getResource } from '@/lib/mcp/resources';
import { allPrompts } from '@/lib/mcp/prompts';
import { validateApiKey, recordApiKeyUsage } from '@/lib/auth/api-keys';

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, mcp-session-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
    name: 'appleui-mcp',
    version: '1.0.0',
    description: 'Apple UI/UX Design Guidelines MCP Server',
    capabilities: ['tools', 'resources', 'prompts'],
  }, { headers: corsHeaders });
}

export async function DELETE() {
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // API Key Authentication
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32001,
        message: 'API key required. Include Authorization: Bearer YOUR_API_KEY header.',
      },
      id: null,
    }, { status: 401, headers: corsHeaders });
  }

  const validation = await validateApiKey(apiKey);
  if (!validation.valid) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32002,
        message: validation.error || 'Invalid or expired API key',
      },
      id: null,
    }, { status: 403, headers: corsHeaders });
  }

  // Record usage asynchronously
  if (validation.apiKeyId) {
    recordApiKeyUsage(validation.apiKeyId).catch(() => {});
  }

  let server: McpServer | undefined;
  let transport: StreamableHTTPServerTransport | undefined;

  try {
    const body = await request.json();

    // Create a fresh server and transport for each request (stateless)
    server = createServer();
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // CRITICAL: undefined enables stateless mode
    });

    // Connect server to transport
    await server.connect(transport);

    // Create a mock request/response for the transport
    const mockReq = {
      method: 'POST',
      headers: Object.fromEntries(request.headers.entries()),
      body,
    };

    // Collect the response
    let responseBody: string = '';
    let responseStatus = 200;
    let responseHeaders: Record<string, string> = {};

    const mockRes = {
      headersSent: false,
      setHeader: (key: string, value: string) => {
        responseHeaders[key] = value;
      },
      status: (code: number) => {
        responseStatus = code;
        return mockRes;
      },
      json: (data: unknown) => {
        responseBody = JSON.stringify(data);
        return mockRes;
      },
      write: (chunk: string) => {
        responseBody += chunk;
      },
      end: () => {},
    };

    await transport.handleRequest(mockReq as any, mockRes as any, body);

    return new NextResponse(responseBody, {
      status: responseStatus,
      headers: {
        ...corsHeaders,
        ...responseHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('MCP Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: error instanceof Error ? error.message : 'Internal error' },
      id: null,
    }, { status: 500, headers: corsHeaders });
  } finally {
    // Cleanup to prevent memory leaks
    if (transport) {
      await transport.close().catch(() => {});
    }
    if (server) {
      await server.close().catch(() => {});
    }
  }
}
