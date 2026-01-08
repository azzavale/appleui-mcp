import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { reviewDesign, designReviewSchema } from '../lib/mcp/tools/designReview';
import { generateComponent, componentGeneratorSchema } from '../lib/mcp/tools/componentGenerator';
import { getStyleGuide, styleGuideSchema } from '../lib/mcp/tools/styleGuideReference';
import { allResources, getResource } from '../lib/mcp/resources';
import { allPrompts, getPrompt } from '../lib/mcp/prompts';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'appleui-mcp',
    version: '1.0.0',
  });

  // Register Tools
  registerTools(server);

  // Register Resources
  registerResources(server);

  // Register Prompts
  registerPrompts(server);

  return server;
}

function registerTools(server: McpServer): void {
  // Design Review Tool
  server.tool(
    'review_design',
    'Analyze code or design for Apple HIG compliance and suggest improvements',
    designReviewSchema.shape,
    async (args) => {
      try {
        const input = designReviewSchema.parse(args);
        const result = reviewDesign(input);
        return {
          content: [
            {
              type: 'text' as const,
              text: formatReviewResult(result),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Component Generator Tool
  server.tool(
    'generate_component',
    'Generate Apple-styled UI components for React, SwiftUI, Tailwind, or CSS',
    componentGeneratorSchema.shape,
    async (args) => {
      try {
        const input = componentGeneratorSchema.parse(args);
        const result = generateComponent(input);
        return {
          content: [
            {
              type: 'text' as const,
              text: formatComponentResult(result),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Style Guide Reference Tool
  server.tool(
    'get_style_guide',
    'Get Apple Human Interface Guidelines for specific design topics',
    styleGuideSchema.shape,
    async (args) => {
      try {
        const input = styleGuideSchema.parse(args);
        const result = getStyleGuide(input);
        return {
          content: [
            {
              type: 'text' as const,
              text: formatStyleGuideResult(result),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

function registerResources(server: McpServer): void {
  // Register resource templates for pattern matching
  server.resource(
    'appleui://colors/{category}',
    'Apple color tokens by category (system, semantic, gradients, all)',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );

  server.resource(
    'appleui://typography/{platform}',
    'Apple typography scale by platform (ios, macos, web, all)',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );

  server.resource(
    'appleui://spacing',
    'Apple 8pt grid spacing system',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );

  server.resource(
    'appleui://animations',
    'Apple animation springs and timing curves',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );

  server.resource(
    'appleui://shadows',
    'Apple shadow elevation levels',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );

  server.resource(
    'appleui://materials',
    'Apple blur materials and vibrancy effects',
    async (uri) => {
      const resource = getResource(uri.href);
      if (!resource) {
        throw new Error(`Resource not found: ${uri.href}`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: resource.mimeType,
            text: resource.getData(),
          },
        ],
      };
    }
  );
}

function registerPrompts(server: McpServer): void {
  for (const prompt of allPrompts) {
    const argsSchema: Record<string, z.ZodType> = {};
    for (const arg of prompt.arguments) {
      argsSchema[arg.name] = arg.required
        ? z.string().describe(arg.description)
        : z.string().optional().describe(arg.description);
    }

    server.prompt(
      prompt.name,
      prompt.description,
      argsSchema,
      async (args) => {
        const stringArgs: Record<string, string> = {};
        for (const [key, value] of Object.entries(args)) {
          if (typeof value === 'string') {
            stringArgs[key] = value;
          }
        }
        return {
          messages: [
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: prompt.getPrompt(stringArgs),
              },
            },
          ],
        };
      }
    );
  }
}

// Formatting helpers
function formatReviewResult(result: ReturnType<typeof reviewDesign>): string {
  let output = `# Design Review Results\n\n`;
  output += `## Overall Score: ${result.overallScore}/100\n\n`;

  if (result.positives.length > 0) {
    output += `## Positive Patterns\n`;
    for (const positive of result.positives) {
      output += `- ${positive}\n`;
    }
    output += '\n';
  }

  if (result.issues.length > 0) {
    output += `## Issues Found (${result.issues.length})\n\n`;
    for (const issue of result.issues) {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
      output += `### ${icon} ${issue.category.toUpperCase()}: ${issue.description}\n`;
      if (issue.currentCode) {
        output += `\n**Current:** \`${issue.currentCode}\`\n`;
      }
      output += `\n**Suggested Fix:** ${issue.suggestedFix}\n`;
      if (issue.higReference) {
        output += `\n*Reference: ${issue.higReference}*\n`;
      }
      output += '\n';
    }
  }

  if (result.recommendations.length > 0) {
    output += `## Recommendations\n`;
    for (const rec of result.recommendations) {
      output += `- ${rec}\n`;
    }
  }

  return output;
}

function formatComponentResult(result: ReturnType<typeof generateComponent>): string {
  let output = `# Generated Component\n\n`;

  output += `## Code\n\`\`\`tsx\n${result.code}\n\`\`\`\n\n`;

  if (result.styles) {
    output += `## Styles\n\`\`\`css\n${result.styles}\n\`\`\`\n\n`;
  }

  output += `## Usage\n\`\`\`tsx\n${result.usage}\n\`\`\`\n\n`;

  output += `## Design Tokens Used\n`;
  output += `- **Colors:** ${result.tokens.colors.join(', ') || 'None'}\n`;
  output += `- **Spacing:** ${result.tokens.spacing.join(', ') || 'None'}\n`;
  output += `- **Typography:** ${result.tokens.typography.join(', ') || 'None'}\n\n`;

  if (result.notes.length > 0) {
    output += `## Notes\n`;
    for (const note of result.notes) {
      output += `- ${note}\n`;
    }
  }

  return output;
}

function formatStyleGuideResult(result: ReturnType<typeof getStyleGuide>): string {
  let output = `# ${result.topic} - Apple Design Guidelines\n\n`;

  output += `## Core Principles\n`;
  for (const principle of result.principles) {
    output += `- ${principle}\n`;
  }
  output += '\n';

  for (const guideline of result.guidelines) {
    output += `## ${guideline.title}\n`;
    output += `${guideline.description}\n\n`;

    output += `### Do\n`;
    for (const item of guideline.do) {
      output += `- ${item}\n`;
    }
    output += '\n';

    output += `### Don't\n`;
    for (const item of guideline.dont) {
      output += `- ${item}\n`;
    }
    output += '\n';
  }

  if (result.codeExamples && result.codeExamples.length > 0) {
    output += `## Code Examples\n\n`;
    for (const example of result.codeExamples) {
      output += `### ${example.platform}\n`;
      output += `${example.description}\n`;
      output += `\`\`\`\n${example.code}\n\`\`\`\n\n`;
    }
  }

  if (result.tokens) {
    output += `## Design Tokens\n`;
    output += `\`\`\`json\n${JSON.stringify(result.tokens, null, 2)}\n\`\`\`\n\n`;
  }

  output += `## HIG References\n`;
  for (const ref of result.higReferences) {
    output += `- ${ref}\n`;
  }

  return output;
}
