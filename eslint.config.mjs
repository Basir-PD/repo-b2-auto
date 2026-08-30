import { dirname } from "path";
import { fileURLToPath } from "url";
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
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
