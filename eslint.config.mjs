import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import tailwindcss from "eslint-plugin-tailwindcss"
import tseslint from "typescript-eslint"

const eslintConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      tailwindcss,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "error",
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
    settings: {
      tailwindcss: {
        callees: ["cn", "cva"],
        config: "",
      },
    },
  },
]

export default eslintConfig
