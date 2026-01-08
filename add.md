# Adding Apple UI MCP Server

## Claude Code

```bash
claude mcp add --transport http appleuimcp https://appleuimcp.com/mcp
```

Or add to `.mcp.json`:
```json
{
  "mcpServers": {
    "appleuimcp": {
      "type": "http",
      "url": "https://appleuimcp.com/mcp"
    }
  }
}
```

## Cursor

Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "appleuimcp": {
      "url": "https://appleuimcp.com/mcp"
    }
  }
}
```

## VS Code Copilot

Add to `.vscode/mcp.json`:
```json
{
  "servers": {
    "appleuimcp": {
      "type": "http",
      "url": "https://appleuimcp.com/mcp"
    }
  }
}
```

## OpenAI Codex

```bash
codex mcp add appleuimcp --url https://appleuimcp.com/mcp
```

Or add to `~/.codex/config.toml`:
```toml
[mcp_servers.appleuimcp]
url = "https://appleuimcp.com/mcp"
```
