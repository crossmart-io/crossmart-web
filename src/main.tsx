import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { installStaleBuildReload } from './lib/stale-build-reload';
import './index.css';

const ROOT_ELEMENT_ID = 'root';

installStaleBuildReload();

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) {
  throw new Error(`Missing #${ROOT_ELEMENT_ID} element in index.html`);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
