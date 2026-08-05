// ESLint flat config — Next.js 16 + TypeScript strict.
// Mirrors the create-next-app default plus our two repo-specific rules:
//   - no raw hex in components (we have Tailwind tokens for that)
//   - no light-mode utilities (dark-only site — see CLAUDE.md)

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Repo-specific guardrails. Light/dark suffix would suggest a theme toggle
      // we explicitly don't ship.
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message:
            "Raw hex literal — use Tailwind tokens (bg-ink, text-accent, ...) defined in src/app/globals.css.",
        },
        {
          selector: "TemplateElement[value.cooked=/\\b(dark|light):/]",
          message:
            "Theme variant — site is dark-only. Remove 'dark:'/'light:' prefixes.",
        },
      ],
    },
  },
  {
    ignores: [".next/", "node_modules/", "out/", "build/", "coverage/"],
  },
];

export default config;