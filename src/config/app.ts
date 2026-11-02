export const APP_NAME = 'Crossmart';

/** Browser tab title for a page: "Products · Crossmart". */
export function toDocumentTitle(pageName: string): string {
  return `${pageName} · ${APP_NAME}`;
}

/** The main landmark, target of the skip link. */
export const MAIN_CONTENT_ID = 'main-content';
