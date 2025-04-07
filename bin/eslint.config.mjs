export default [
  {
    root: false, // Allow parent configs to apply
    env: {
      node: true,
      commonjs: true,
      es2023: true, // Updated to latest stable ES version
    },
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: "script", // Use "script" for CommonJS instead of "module"
    },
    extends: [
      "../.eslintrc.js", // Extend from parent config
    ],
    rules: {
      // CommonJS specific rules
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
      "import/no-commonjs": "off",
      "import/first": "off",
      "global-require": "off",

      // Node script friendly rules
      "no-console": "off",
      "node/no-unpublished-require": "off",

      // Security-related rules for CLI scripts
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-child-process": "warn",
    },
    overrides: [
      {
        files: ["*.js"],
        rules: {
          // Disable TypeScript-specific rules for .js files
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-explicit-any": "off",
        },
      },
    ],
  },
];
