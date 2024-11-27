import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "dist/index.js",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "MaskedPassword",
        sourcemap: true,
      },
      {
        file: "dist/index.umd.min.js",
        format: "umd",
        name: "MaskedPassword",
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [resolve(), commonjs()],
  },
];

