'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ApiKey {
  id: string;
  prefix: string;
  name: string;
  requestCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

interface UserData {
  email: string;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  apiKeys: ApiKey[];
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchUserData = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch user data');
        return;
      }

      setUserData(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!userData) return;

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate API key');
        return;
      }

      setNewApiKey(data.key);
      // Refresh user data to show updated keys
      await fetchUserData();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        {success && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
              Payment successful!
            </h2>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Your subscription is now active. Enter your email below to view your API key.
            </p>
          </div>
        )}

        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-[var(--foreground-muted)] mb-8">
          Manage your subscription and API keys
        </p>

        {/* Email Input */}
        {!userData && (
          <div className="p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-8">
            <label className="block text-sm font-medium mb-2">Your email</label>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUserData()}
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--taupe-500)]"
              />
              <button
                onClick={fetchUserData}
                disabled={isLoading}
                className="px-6 py-3 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'View'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* User Data */}
        {userData && (
          <>
            {/* Subscription Status */}
            <div className="p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Subscription</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData.subscriptionStatus === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {userData.subscriptionStatus}
                </span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                Email: {userData.email}
              </p>
              {userData.currentPeriodEnd && (
                <p className="text-[var(--foreground-muted)] text-sm">
                  Renews: {new Date(userData.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* New API Key Alert */}
            {newApiKey && (
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl mb-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Your new API key
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  Copy this key now. You won't be able to see it again.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-sm font-mono break-all">
                    {newApiKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newApiKey)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* API Keys */}
            <div className="p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">API Keys</h2>
                <button
                  onClick={generateNewKey}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate new key'}
                </button>
              </div>

              {userData.apiKeys.length === 0 ? (
                <p className="text-[var(--foreground-muted)] text-sm">
                  No API keys found. Generate one to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {userData.apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono">{key.prefix}</code>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {key.requestCount} requests
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                        {key.lastUsedAt && ` • Last used: ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>

            {/* Setup Instructions */}
            <div className="p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <h2 className="text-lg font-semibold mb-4">Quick setup</h2>
              <p className="text-[var(--foreground-muted)] text-sm mb-4">
                Add this to your MCP client configuration:
              </p>
              <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
{`{
  "mcpServers": {
    "appleui": {
      "url": "https://appleui-mcp.vercel.app/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => {
                setUserData(null);
                setNewApiKey(null);
                setEmail('');
              }}
              className="mt-6 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              ← Use different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
