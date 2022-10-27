module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
    plugins: ['react', '@typescript-eslint'
  ],
      parserOptions: {
    tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'
    ],
  },
  root: true,
    rules: {
    'no-debugger': 'warn', // instead of default error
      indent: ['warn',
      2,
      { SwitchCase: 1
      }
    ], // instead of default 4
        'no-undef': 'off',
  },
};
