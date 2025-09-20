import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Bring in Next.js shareable configs via FlatCompat
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".idea/*",
      ".vscode/*",
      "coverage/*",
      "app/sentry-example-page/*",
      "dist/*",
      "docs/**/*"
    ],
  },
  {
    rules: {
      // Allow using `any` in this project. If you want stricter typing later,
      // change this to "warn" or "error" and fix occurrences incrementally.
      "@typescript-eslint/no-explicit-any": "off",

      // Match user's desired settings
      "no-undef": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
