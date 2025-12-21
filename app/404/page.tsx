/** This page reuses the special not-found page
 * It re-exports it so we can have a linkable URL,
 * And with this linkable URL we can call it wherever we desire
 */
import * as Sentry from '@sentry/nextjs';
export {default} from '@/app/not-found'