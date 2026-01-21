import { inspect } from 'util';

const DEBUG =
  typeof process.env.DEBUG_LOGS !== 'undefined'
    ? process.env.DEBUG_LOGS === 'true'
    : process.env.NODE_ENV !== 'production';

function safeInspect(value: unknown, depth = 4) {
  try {
    return inspect(value, { showHidden: false, depth });
  } catch {
    return String(value);
  }
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.debug('[debug]', ...args.map((a) => (typeof a === 'object' ? safeInspect(a) : a)));
  },
  info: (...args: unknown[]) => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.info('[info]', ...args.map((a) => (typeof a === 'object' ? safeInspect(a) : a)));
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn('[warn]', ...args.map((a) => (typeof a === 'object' ? safeInspect(a) : a)));
  },
  error: (msg: unknown, err?: unknown) => {
    // Always log a concise error message
    // eslint-disable-next-line no-console
    console.error('[error]', typeof msg === 'object' ? safeInspect(msg) : msg);

    // In debug mode, log the inspected error and stack if present
    if (DEBUG && err) {
      try {
        // eslint-disable-next-line no-console
        console.error('[error][debug]', safeInspect(err, 6));
      } catch {
        // eslint-disable-next-line no-console
        console.error('[error][debug] (failed to inspect)', err);
      }
      if (err instanceof Error && err.stack) {
        // eslint-disable-next-line no-console
        console.error('[error][stack]', err.stack);
      }
    }
  },
};

export default logger;
