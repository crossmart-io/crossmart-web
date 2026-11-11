/** How long after connecting a store its setup is offered: 15 minutes, past a slow OAuth trip. */
export const JUST_CONNECTED_WINDOW_MS = 900_000;

export const STORE_SETUP_COPY = {
  title: (storeName: string) => `Set up ${storeName}`,
  description: 'One step, and your products can go live.',
  autoAdd: 'Add all my active products',
  autoAddHint: 'Products you make active later are added too. Change it in the store’s settings.',
  save: 'Save',
  saving: 'Saving…',
  skip: 'Skip',
} as const;
