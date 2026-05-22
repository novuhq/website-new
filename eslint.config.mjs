import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import tseslint from "typescript-eslint"

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-docs/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "warn",
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]

export default eslintConfig
