import PocketBase from 'pocketbase';

/**
 * Initializes the PocketBase client.
 * Uses the environment variable VITE_POCKETBASE_URL if available,
 * otherwise falls back to local development http://127.0.0.1:8090.
 */
const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseUrl);

// Optional: Enable auto-cancellation globally or configure other default behaviors here
// pb.autoCancellation(true);
