import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15.1 ships eslintrc-style configs (a bare `extends`
// object), so they have to be translated before ESLint 9 flat config can
// use them. Importing them directly yields "nextVitals is not iterable".
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      // Written by `npx convex dev` — not ours to lint.
      "convex/_generated/**",
      // Local worktrees from earlier sessions: gitignored copies of the repo
      // that ESLint would otherwise lint as if they were source.
      ".claude/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // A leading underscore is the conventional marker for a parameter that
    // exists to hold a position in a signature, which is exactly what a
    // typed mock needs.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
