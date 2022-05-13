module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-debugger": "warn", // instead of default error
    indent: ["warn", 2, { SwitchCase: 1 }], // instead of default 4
  },
};
