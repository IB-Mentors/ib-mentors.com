import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", ".next-build/**", "node_modules/**", "next-env.d.ts", "qa/**"] },
  { rules: { "@next/next/no-img-element": "off" } },
];

export default config;
