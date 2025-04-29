// backend/eslint.config.cjs
module.exports = {
  env: {
    node:   true,
    es2021: true,
    jest:   true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType:  "module"
  },
  rules: {
    // Aquí puedes personalizar tus reglas
  }
};
