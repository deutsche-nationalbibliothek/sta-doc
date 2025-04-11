module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
  ],
  plugins: ['react', '@emotion', '@typescript-eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './bin/tsconfig.json'],
  },
  root: true,
  rules: {
    '@emotion/pkg-renaming': 'error',
    // 'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    // '@typescript-eslint/no-unsafe-assignment': 0,
    // '@typescript-eslint/no-misused-promises': 0,
    // '@typescript-eslint/no-unsafe-member-access': 0,
    // '@typescript-eslint/no-unsafe-return': 0,
    // '@typescript-eslint/no-unsafe-call': 0,
    // '@typescript-eslint/no-floating-promises': 0,
    // 'prefer-const': 0,
    'no-debugger': 'warn', // instead of default error
    'no-undef': 'off',

    indent: 'off',
  },
};
