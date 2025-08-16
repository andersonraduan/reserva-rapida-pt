import { setupWorker } from 'msw/browser';
import { handlers } from './mocks';

export const worker = setupWorker(...handlers);

// Start the worker in development
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}