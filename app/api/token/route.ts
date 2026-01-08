import { NextRequest, NextResponse } from 'next/server';

// Token endpoint for MCP OAuth flow
// Since we use API keys (not OAuth), this returns an error directing users to get API keys

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // This server uses API keys, not OAuth tokens
  // Redirect users to get an API key from the dashboard
  return NextResponse.json({
    error: 'invalid_grant',
    error_description: 'This server uses API keys. Get your key at https://appleuimcp.com/dashboard and use it with Authorization: Bearer YOUR_API_KEY header.',
  }, { status: 400, headers: corsHeaders });
}
