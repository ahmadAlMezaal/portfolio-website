import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const arrowFunctionsOnly = [
  {
    selector: "FunctionExpression",
    message: "Use an arrow function instead of a function expression.",
  },
  {
    selector: "FunctionDeclaration",
    message: "Use `const name = () => {}` instead of a function declaration.",
  },
];

const noDefaultExport = {
  selector: "ExportDefaultDeclaration",
  message:
    "Use a named export. Default exports are only for Next.js file conventions in src/app.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: true,
          variables: true,
          classes: true,
          typedefs: false,
          ignoreTypeReferences: true,
        },
      ],
      "no-restricted-syntax": ["error", ...arrowFunctionsOnly, noDefaultExport],
    },
  },
  {
    files: ["src/app/**", "*.config.{mjs,ts,js}"],
    rules: {
      "no-restricted-syntax": ["error", ...arrowFunctionsOnly],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
