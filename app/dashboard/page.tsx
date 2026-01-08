'use client';

import { useState, Suspense } from 'react';
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

function SuccessBanner() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  if (!success) return null;

  return (
    <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
      <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
        Payment successful!
      </h2>
      <p className="text-green-700 dark:text-green-300 text-sm">
        Your subscription is now active. Enter your email below to view your API key.
      </p>
    </div>
  );
}

// Modal component for displaying new API key with forced copy
function ApiKeyModal({
  apiKey,
  onClose
}: {
  apiKey: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
  };

  const handleClose = () => {
    if (!copied) {
      const confirmClose = window.confirm(
        'You have not copied your API key! Are you sure you want to close? You will NOT be able to see this key again.'
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[var(--background)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] max-w-lg w-full p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Warning Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">Save Your API Key</h3>
            <p className="text-[var(--foreground-muted)] text-xs sm:text-sm">This is the only time you will see this key</p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-4">
          <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-medium">
            For security reasons, we don't store your full API key. If you lose it, you'll need to generate a new one.
          </p>
        </div>

        {/* API Key Display */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your API Key</label>
          <div className="p-3 sm:p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] font-mono text-xs sm:text-sm break-all select-all">
            {apiKey}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className={`w-full py-3 sm:py-4 rounded-xl font-medium transition-all mb-4 flex items-center justify-center gap-2 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] hover:opacity-90 active:opacity-80'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied to clipboard!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy API Key
            </>
          )}
        </button>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-[var(--border)] text-[var(--taupe-600)] focus:ring-[var(--taupe-500)]"
          />
          <span className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            I have saved my API key in a secure location and understand I won't be able to see it again.
          </span>
        </label>

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={!confirmed && !copied}
          className={`w-full py-3 sm:py-4 rounded-xl font-medium transition-all ${
            confirmed || copied
              ? 'bg-[var(--background-secondary)] border border-[var(--border)] hover:bg-[var(--background)] active:opacity-80 text-[var(--foreground)]'
              : 'bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-muted)] opacity-50 cursor-not-allowed'
          }`}
        >
          {confirmed || copied ? 'Done' : 'Copy or confirm to continue'}
        </button>
      </div>
    </div>
  );
}

// Confirmation modal for destructive actions
function ConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[var(--background)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] max-w-md w-full p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-[var(--foreground-muted)] text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-medium bg-[var(--background-secondary)] border border-[var(--border)] hover:bg-[var(--background)] active:opacity-80 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'revoke' | 'regenerate';
    keyId: string;
    keyPrefix: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    } catch {
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
      setShowKeyModal(true);
      // Refresh user data to show updated keys
      await fetchUserData();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = async (keyId: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/keys/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to revoke API key');
        return;
      }

      // Refresh user data
      await fetchUserData();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const regenerateKey = async (keyId: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/keys/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to regenerate API key');
        return;
      }

      setNewApiKey(data.key);
      setShowKeyModal(true);
      // Refresh user data
      await fetchUserData();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'revoke') {
      revokeKey(confirmAction.keyId);
    } else {
      regenerateKey(confirmAction.keyId);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        <Suspense fallback={null}>
          <SuccessBanner />
        </Suspense>

        {/* Home button */}
        <a href="/" className="inline-flex items-center py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
          ← Home
        </a>

        <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-[var(--foreground-muted)] mb-6 sm:mb-8">
          Manage your subscription and API keys
        </p>

        {/* Email Input */}
        {!userData && (
          <div className="p-4 sm:p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-6 sm:mb-8">
            <label className="block text-sm font-medium mb-2">Your email</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUserData()}
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--taupe-500)] text-base"
              />
              <button
                onClick={fetchUserData}
                disabled={isLoading}
                className="px-6 py-3 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-xl font-medium hover:opacity-90 active:opacity-80 transition-all disabled:opacity-50"
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
            <div className="p-4 sm:p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold">Subscription</h2>
                {(() => {
                  const status = userData.subscriptionStatus;
                  const periodEnd = userData.currentPeriodEnd ? new Date(userData.currentPeriodEnd) : null;
                  const isPeriodActive = periodEnd && periodEnd > new Date();
                  const isActive = (status === 'active' || status === 'trialing' || status === 'canceled') && isPeriodActive;

                  return isActive ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                      inactive
                    </span>
                  );
                })()}
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                Email: {userData.email}
              </p>
              {userData.currentPeriodEnd && (() => {
                const status = userData.subscriptionStatus;
                const periodEnd = new Date(userData.currentPeriodEnd);
                const isPeriodActive = periodEnd > new Date();
                const isCanceled = status === 'canceled';

                if (isCanceled && isPeriodActive) {
                  return (
                    <p className="text-[var(--foreground-muted)] text-sm">
                      Access until: {periodEnd.toLocaleDateString()}
                    </p>
                  );
                } else if (isPeriodActive) {
                  return (
                    <p className="text-[var(--foreground-muted)] text-sm">
                      Renews: {periodEnd.toLocaleDateString()}
                    </p>
                  );
                } else {
                  return (
                    <p className="text-[var(--foreground-muted)] text-sm">
                      Expired: {periodEnd.toLocaleDateString()}
                    </p>
                  );
                }
              })()}
            </div>

            {/* API Keys */}
            <div className="p-4 sm:p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-base sm:text-lg font-semibold">API Keys</h2>
                <button
                  onClick={generateNewKey}
                  disabled={isGenerating}
                  className="px-4 py-3 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-lg text-sm font-medium hover:opacity-90 active:opacity-80 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate new key'}
                </button>
              </div>

              {/* Info Banner */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-4">
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  <strong>Lost your key?</strong> Use "Regenerate" to create a new key. The old key will be revoked immediately.
                </p>
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
                      <p className="text-xs text-[var(--foreground-muted)] mb-3">
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                        {key.lastUsedAt && ` • Last used: ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                      </p>

                      {/* Key Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmAction({ type: 'regenerate', keyId: key.id, keyPrefix: key.prefix })}
                          className="flex-1 px-3 py-3 text-xs sm:text-sm font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/50 active:bg-amber-300 dark:active:bg-amber-900/70 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'revoke', keyId: key.id, keyPrefix: key.prefix })}
                          className="px-3 py-3 text-xs sm:text-sm font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 active:bg-red-300 dark:active:bg-red-900/70 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>

            {/* Setup Instructions */}
            <div className="p-4 sm:p-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Quick setup</h2>
              <p className="text-[var(--foreground-muted)] text-sm mb-4">
                Add to your MCP client configuration:
              </p>
              <div className="space-y-4">
                {/* Claude Code */}
                <div>
                  <h3 className="text-xs font-semibold mb-1.5 text-[var(--foreground-muted)]">Claude Code</h3>
                  <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`claude mcp add appleuimcp --transport http \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  https://appleuimcp.com/mcp`}
                    </pre>
                  </div>
                </div>
                {/* Cursor */}
                <div>
                  <h3 className="text-xs font-semibold mb-1.5 text-[var(--foreground-muted)]">Cursor <span className="font-normal opacity-70">~/.cursor/mcp.json</span></h3>
                  <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`{
  "mcpServers": {
    "appleuimcp": {
      "url": "https://appleuimcp.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}`}
                    </pre>
                  </div>
                </div>
                {/* VS Code Copilot */}
                <div>
                  <h3 className="text-xs font-semibold mb-1.5 text-[var(--foreground-muted)]">VS Code Copilot <span className="font-normal opacity-70">.vscode/mcp.json</span></h3>
                  <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`{
  "servers": {
    "appleuimcp": {
      "type": "http",
      "url": "https://appleuimcp.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}`}
                    </pre>
                  </div>
                </div>
                {/* OpenAI Codex */}
                <div>
                  <h3 className="text-xs font-semibold mb-1.5 text-[var(--foreground-muted)]">OpenAI Codex <span className="font-normal opacity-70">~/.codex/config.toml</span></h3>
                  <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs font-mono">
{`[mcp_servers.appleuimcp]
url = "https://appleuimcp.com/mcp"
bearer_token_env_var = "APPLEUIMCP_API_KEY"`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => {
                setUserData(null);
                setNewApiKey(null);
                setEmail('');
              }}
              className="mt-6 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ← Use different email
            </button>
          </>
        )}
      </div>

      {/* API Key Modal */}
      {showKeyModal && newApiKey && (
        <ApiKeyModal
          apiKey={newApiKey}
          onClose={() => {
            setShowKeyModal(false);
            setNewApiKey(null);
          }}
        />
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.type === 'revoke' ? 'Revoke API Key?' : 'Regenerate API Key?'}
          message={
            confirmAction.type === 'revoke'
              ? `This will permanently revoke the key "${confirmAction.keyPrefix}". Any applications using this key will stop working immediately.`
              : `This will revoke the key "${confirmAction.keyPrefix}" and create a new one. Your current key will stop working immediately.`
          }
          confirmText={confirmAction.type === 'revoke' ? 'Revoke Key' : 'Regenerate Key'}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
          isLoading={isProcessing}
        />
      )}
    </div>
  );
}
