import { NextResponse } from 'next/server';

// OAuth 2.0 Authorization Server Metadata (RFC 8414)
// For MCP servers using API key authentication, we return minimal metadata

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  // Return metadata indicating this server uses Bearer token auth (API keys)
  // Not a full OAuth server - clients should use pre-configured API keys
  return NextResponse.json({
    issuer: 'https://appleuimcp.com',
    token_endpoint: 'https://appleuimcp.com/api/token',
    response_types_supported: ['token'],
    grant_types_supported: ['client_credentials'],
    token_endpoint_auth_methods_supported: ['none'],
    service_documentation: 'https://appleuimcp.com',
  }, { headers: corsHeaders });
}
