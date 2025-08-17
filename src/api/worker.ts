import { setupWorker } from 'msw/browser';
import { handlers } from './mocks';

export const worker = setupWorker(...handlers);

// Start the worker in development - temporarily disabled to fix routing issues
if (false && import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  }).catch(console.error);
}