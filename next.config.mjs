/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server components
  serverExternalPackages: [],
  // Allow existing API routes in /api folder
  async rewrites() {
    return [
      {
        source: '/mcp',
        destination: '/api/mcp',
      },
    ];
  },
  // Headers for MCP endpoint
  async headers() {
    return [
      {
        source: '/api/mcp',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, mcp-session-id' },
        ],
      },
      {
        source: '/mcp',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, mcp-session-id' },
        ],
      },
    ];
  },
};

export default nextConfig;
