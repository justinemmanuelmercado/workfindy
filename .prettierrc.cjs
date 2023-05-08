module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
