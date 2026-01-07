 /**
 * Seed notifications dataset used to initialize the local persistence layer.
 *
 * NOTE: The orchestrator-provided attachment path was not accessible from this runtime,
 * so this file currently contains a minimal placeholder seed.
 *
 * Replace the contents of `initialNotifications` with the authoritative array from
 * the user attachment when it is available in-repo.
 */

/**
 * PUBLIC_INTERFACE
 * initialNotifications: seed notifications used to initialize localStorage.
 * Each notification should include:
 *  - id: string (stable)
 *  - title: string
 *  - message/body: string
 *  - date/time: string (ISO preferred)
 *  - type/category: string (optional)
 */
export const initialNotifications = [
  {
    id: "seed_welcome_1",
    title: "Welcome to CareerConnect",
    message:
      "Your notification center is ready. New alerts will appear here as you apply and track jobs.",
    createdAt: new Date().toISOString(),
    type: "system",
    // `read` is managed by the storage layer; seed can omit it.
  },
];
