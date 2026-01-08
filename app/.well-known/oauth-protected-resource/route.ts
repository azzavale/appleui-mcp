import { NextResponse } from 'next/server';

// OAuth 2.0 Protected Resource Metadata (RFC 9470)
// This tells MCP clients how to authenticate with this resource

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  // Return protected resource metadata indicating Bearer token authentication
  return NextResponse.json({
    resource: 'https://appleuimcp.com/mcp',
    bearer_methods_supported: ['header'],
    resource_documentation: 'https://appleuimcp.com',
  }, { headers: corsHeaders });
}
