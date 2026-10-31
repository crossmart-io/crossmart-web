const DEFAULT_API_URL = 'http://localhost:3000';

/** Build-time configuration. Read `import.meta.env` only here. */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
} as const;
