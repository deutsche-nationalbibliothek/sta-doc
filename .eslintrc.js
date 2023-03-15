module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
  ],
  plugins: ['react', '@typescript-eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './bin/tsconfig.json'],
  },
  root: true,
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    'prefer-const': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-floating-promises': 0,
    'no-debugger': 'warn', // instead of default error
    indent: 'off', // instead of default 4
    'no-undef': 'off',
  },
};
