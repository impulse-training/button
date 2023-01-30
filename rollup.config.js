import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";
import { minify } from "uglify-js";
import tsconfig from "./tsconfig.json";

export default [
  {
    input: "src/index.ts",
    output: {
      name: "Impulse",
      file: "dist/impulse.js",
    },
    plugins: [
      resolve(),
      // babel({ babelHelpers: "bundled" }),
      typescript({
        ...tsconfig.compilerOptions,
        include: "**/*.{js,ts}",
      }),
      uglify(
        {
          mangle: {
            toplevel: true,
          },
        },
        minify
      ),
    ],
  },
];
