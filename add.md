claude mcp add --transport http appleui https://appleui-mcp.vercel.app/mcp

Created both folders. Here's a prompt you can use for testing:

  ---
  Test Prompt:

  Create a single-page React Native mobile app for a "Daily Habits" tracker. The app should have:
  - A header with the app title and current date
  - A list of habits with checkboxes (e.g., "Drink water", "Exercise", "Read")
  - A floating action button to add new habits
  - A progress indicator showing completion percentage
  - Support for dark mode

  Make it look and feel like a native iOS app with proper styling.

  ---
  To test:

  1. With MCP - In the current directory (where the MCP is configured), start a new Claude Code session and use the prompt above. Claude should have access to the Apple UI tools.
  2. Without MCP - Navigate to the test-without-mcp folder and start a fresh Claude Code session there (no MCP configured).

  To disable the MCP temporarily for the "without" test, you can run:
  claude mcp remove appleui

  And re-add it after:
  claude mcp add --transport http appleui https://appleui-mcp.vercel.app/mcp

  Or simply start Claude in a different directory that doesn't inherit the config.

  Would you like me to generate the "with MCP" version now using the Apple UI tools?