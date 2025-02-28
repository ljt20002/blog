const changeRules = {
  '@typescript-eslint/naming-convention': 'warn',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-uses-react': 'off',
};
const customRules = {
  ...changeRules,
};
module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: '@byted/eslint-config-standard',
    },
    {
      files: ['*.ts', '*.mts', '*.tsx'],
      extends: '@byted/eslint-config-standard-ts',
      rules: {
        ...customRules,
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      extends: '@byted/eslint-config-standard-react',
      rules: {
        ...customRules,
      },
    },
  ],
};
