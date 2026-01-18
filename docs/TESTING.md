Test Framework (Vitest) — Project Documentation

Overview
- This project uses Vitest + Testing Library (jsdom) for unit and component tests.
- Tests live under the `test/` directory and use TypeScript where appropriate.

Quick setup
1. Install dev dependencies (if not already installed):

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

2. Recommended npm scripts in `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest"
  }
}
```

Vitest config (key points)
- Use `jsdom` environment for DOM tests.
- Configure path alias `@` to project root so tests can import `@/...`.
- Example (minimal) `vitest.config.ts` snippet:

```ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  plugins: [tsconfigPaths()],
})
```

Test setup file (`test/setup.ts`)
- Register matchers and global test helpers here. Example:

```ts
import '@testing-library/jest-dom'
// global mocks shared across tests can go here
```

Secrets reminder
- Do not commit real credentials. Keep all secrets in `.env` (which must be gitignored). Tests should mock `@/env.mjs` or set CI secrets; never store API keys or DB URIs in repo files.

Common patterns used in tests
- Mocking env imports that perform import-time validation (very important):

```ts
vi.mock('@/env.mjs', () => ({
  env: {
    NEXT_PUBLIC_WHEREBY_SUBDOMAIN_URL: 'https://whereby.example',
    NEXT_PUBLIC_APP_URL: 'https://app.example',
  },
}))
```

- Stubbing protected globals (e.g., `crypto.randomUUID`):

```ts
beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' })
})
```

- Mock network / action modules:

```ts
vi.mock('@/lib/actions/meetings.actions', () => ({
  createMeetingLink: vi.fn(async () => ({ success: true })),
}))
```

- Use `vi.mock` / `vi.stubGlobal` rather than mutating read-only globals or overwriting node built-ins.

Common pitfalls & fixes
- Import-time env validation failures
  - Cause: `@/env.mjs` validates required variables at import time. Fix by mocking `@/env.mjs` in the test file.

- Tests that complain about labels ("label with the text ... no form control")
  - Cause: labels in the component are present but not `for`-linked to inputs (or aria attributes missing) so Testing Library can't find the control via label.
  - Fix: Select inputs by `name` using the rendered container, e.g.:

```ts
const { container } = render(<MeetingForm />)
const startInput = container.querySelector('input[name="timeDetails.meetingStartTime"]')
```

- Multiple elements with same placeholder or text
  - Cause: repeated placeholder text (e.g., multiple `email@example.com` inputs).
  - Fix: use `getAllByPlaceholderText` and index the desired element, or target by `name`.

- Overwriting `global.crypto` or other read-only globals
  - Cause: failing to use Vitest helpers to stub globals.
  - Fix: use `vi.stubGlobal('crypto', ...)`.

Test execution
- Run full suite:

```bash
npx vitest run --reporter verbose
# or
npm test
```

- Run a single test file:

```bash
npx vitest run test/meetingForm.test.tsx
```

- Run in watch/interactive mode:

```bash
npx vitest
```

CI integration
- Add `npm test` to CI steps.
- Ensure CI sets required env vars or the test mocks `@/env.mjs` as shown above.

Extending tests
- Prefer TypeScript tests (`.test.ts` / `.test.tsx`) for better type-safety.
- Keep fixtures small and mock external services (Resend, Whereby) rather than calling them.

Troubleshooting checklist
- If tests fail on import: check `@/env.mjs` import-time validation.
- If a DOM control isn't found: inspect rendered HTML in the test error output; select by `name`/`id` if labels aren't linked.
- If a mock doesn't appear to be applied: ensure `vi.resetModules()` is not clearing mocks unexpectedly, and that mocks are declared before imports that use them.

Contacts & next steps
- If you want, I can:
  - Add a CI job snippet that runs `npm test`.
  - Convert any remaining JS tests to TS and remove legacy duplicates.


---
Generated on 2026-01-18
