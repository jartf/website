import nextPlugin from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", ".cache/**"],
  },
  ...nextPlugin,
];

export default eslintConfig;
