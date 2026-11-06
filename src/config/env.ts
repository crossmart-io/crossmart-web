const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_MCP_URL = 'http://localhost:3100/mcp';

/** Build-time configuration. Read `import.meta.env` only here. */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
  /** The remote MCP server AI assistants connect to. */
  mcpUrl: import.meta.env.VITE_MCP_URL ?? DEFAULT_MCP_URL,
} as const;
