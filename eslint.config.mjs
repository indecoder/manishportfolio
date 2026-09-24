import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint 10 flat config.
 *
 * `eslint-config-next` v16 already ships flat configs, so they are spread
 * directly - wrapping them in FlatCompat (the eslintrc bridge) produces a
 * "Converting circular structure to JSON" failure.
 */
const eslintConfig = [
  {
    ignores: [
      "out/**",
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      ".firebase/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Build-time Node scripts run outside the browser bundle.
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
];

export default eslintConfig;
