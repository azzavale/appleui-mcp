import { NextRequest, NextResponse } from 'next/server';

import { reviewDesign, designReviewSchema } from '@/lib/mcp/tools/designReview';
import { generateComponent, componentGeneratorSchema } from '@/lib/mcp/tools/componentGenerator';
import { getStyleGuide, styleGuideSchema } from '@/lib/mcp/tools/styleGuideReference';
import { allResources, getResource } from '@/lib/mcp/resources';
import { allPrompts } from '@/lib/mcp/prompts';
import { validateApiKey, recordApiKeyUsage } from '@/lib/auth/api-keys';

// MCP Protocol version
const PROTOCOL_VERSION = '2024-11-05';
const SUPPORTED_VERSIONS = ['2024-11-05', '2024-10-07'];

// Tool definitions for MCP
const toolDefinitions = [
  {
    name: 'review_design',
    description: 'Analyze code or design for Apple HIG compliance and suggest improvements',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: { type: 'string', description: 'The code to review' },
        platform: {
          type: 'string',
          enum: ['ios', 'macos', 'visionos', 'watchos'],
          description: 'Target Apple platform'
        },
        focus: {
          type: 'array',
          items: { type: 'string', enum: ['colors', 'typography', 'spacing', 'layout', 'accessibility', 'animations'] },
          description: 'Areas to focus review on'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'generate_component',
    description: 'Generate Apple-styled UI components for React, SwiftUI, Tailwind, or CSS',
    inputSchema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['button', 'card', 'input', 'modal', 'navigation', 'list', 'toggle', 'slider'],
          description: 'Component type to generate'
        },
        variant: {
          type: 'string',
          enum: ['primary', 'secondary', 'tertiary', 'destructive'],
          description: 'Visual variant'
        },
        platform: {
          type: 'string',
          enum: ['react', 'swiftui', 'tailwind', 'css'],
          description: 'Output platform/framework'
        },
        darkMode: { type: 'boolean', description: 'Include dark mode support' }
      },
      required: ['type', 'platform']
    }
  },
  {
    name: 'get_style_guide',
    description: 'Get Apple Human Interface Guidelines for specific design topics',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          enum: ['colors', 'typography', 'spacing', 'layout', 'icons', 'motion', 'accessibility'],
          description: 'Design topic'
        },
        platform: {
          type: 'string',
          enum: ['ios', 'macos', 'visionos', 'watchos'],
          description: 'Target platform'
        }
      },
      required: ['topic']
    }
  }
];

// Resource definitions
const resourceDefinitions = allResources.map(r => ({
  uri: r.uri,
  name: r.name,
  description: r.description,
  mimeType: r.mimeType,
}));

// Prompt definitions
const promptDefinitions = allPrompts.map(p => ({
  name: p.name,
  description: p.description,
  arguments: p.arguments.map(a => ({
    name: a.name,
    description: a.description,
    required: a.required
  }))
}));

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
    name: 'appleuimcp',
    version: '1.0.0',
    description: 'Apple UI/UX Design Guidelines MCP Server',
    capabilities: ['tools', 'resources', 'prompts'],
  }, { headers: corsHeaders });
}

export async function DELETE() {
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

// JSON-RPC request/response types
interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id?: string | number | null;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
  id: string | number | null;
}

// Handle individual JSON-RPC methods
async function handleMethod(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  switch (method) {
    case 'initialize':
      return handleInitialize(params);
    case 'initialized':
      return {}; // Notification, no response needed
    case 'tools/list':
      return { tools: toolDefinitions };
    case 'tools/call':
      return handleToolCall(params);
    case 'resources/list':
      return { resources: resourceDefinitions };
    case 'resources/read':
      return handleResourceRead(params);
    case 'prompts/list':
      return { prompts: promptDefinitions };
    case 'prompts/get':
      return handlePromptGet(params);
    case 'ping':
      return {};
    default:
      throw { code: -32601, message: `Method not found: ${method}` };
  }
}

function handleInitialize(params: Record<string, unknown>) {
  const clientVersion = params.protocolVersion as string | undefined;

  // Check if client version is supported
  if (clientVersion && !SUPPORTED_VERSIONS.includes(clientVersion)) {
    console.warn(`Client requested unsupported protocol version: ${clientVersion}`);
  }

  return {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
      prompts: { listChanged: false },
    },
    serverInfo: {
      name: 'appleuimcp',
      version: '1.0.0',
    },
  };
}

async function handleToolCall(params: Record<string, unknown>) {
  const toolName = params.name as string;
  const args = (params.arguments || {}) as Record<string, unknown>;

  switch (toolName) {
    case 'review_design': {
      try {
        const input = designReviewSchema.parse(args);
        const result = reviewDesign(input);
        return {
          content: [{ type: 'text', text: formatReviewResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    case 'generate_component': {
      try {
        const input = componentGeneratorSchema.parse(args);
        const result = generateComponent(input);
        return {
          content: [{ type: 'text', text: formatComponentResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    case 'get_style_guide': {
      try {
        const input = styleGuideSchema.parse(args);
        const result = getStyleGuide(input);
        return {
          content: [{ type: 'text', text: formatStyleGuideResult(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    default:
      throw { code: -32601, message: `Unknown tool: ${toolName}` };
  }
}

async function handleResourceRead(params: Record<string, unknown>) {
  const uri = params.uri as string;
  const resource = getResource(uri);

  if (!resource) {
    throw { code: -32602, message: `Resource not found: ${uri}` };
  }

  return {
    contents: [{ uri, mimeType: resource.mimeType, text: resource.getData() }],
  };
}

async function handlePromptGet(params: Record<string, unknown>) {
  const promptName = params.name as string;
  const args = (params.arguments || {}) as Record<string, string>;

  const prompt = allPrompts.find(p => p.name === promptName);
  if (!prompt) {
    throw { code: -32602, message: `Prompt not found: ${promptName}` };
  }

  return {
    messages: [{ role: 'user', content: { type: 'text', text: prompt.getPrompt(args) } }],
  };
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

  let validation;
  try {
    validation = await validateApiKey(apiKey);
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32002,
        message: 'API key validation failed',
      },
      id: null,
    }, { status: 500, headers: corsHeaders });
  }

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

  try {
    const body = await request.json() as JsonRpcRequest | JsonRpcRequest[];

    // Handle batch requests
    if (Array.isArray(body)) {
      const responses: JsonRpcResponse[] = [];
      for (const req of body) {
        const response = await processRequest(req);
        if (response) responses.push(response);
      }
      return NextResponse.json(responses, { headers: corsHeaders });
    }

    // Handle single request
    const response = await processRequest(body);

    // Notifications don't get responses
    if (!response) {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.error('MCP Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: error instanceof Error ? error.message : 'Internal error' },
      id: null,
    }, { status: 500, headers: corsHeaders });
  }
}

async function processRequest(req: JsonRpcRequest): Promise<JsonRpcResponse | null> {
  // Notifications (no id) don't get responses
  const isNotification = req.id === undefined;

  try {
    const result = await handleMethod(req.method, req.params as Record<string, unknown>);

    if (isNotification) {
      return null;
    }

    return {
      jsonrpc: '2.0',
      result,
      id: req.id ?? null,
    };
  } catch (error) {
    if (isNotification) {
      console.error(`Error handling notification ${req.method}:`, error);
      return null;
    }

    const rpcError = error as { code?: number; message?: string };
    return {
      jsonrpc: '2.0',
      error: {
        code: rpcError.code || -32603,
        message: rpcError.message || 'Internal error',
      },
      id: req.id ?? null,
    };
  }
}
