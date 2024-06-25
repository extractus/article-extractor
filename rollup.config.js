import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default {
	input: "src/main.js",
	output: {
		file: "bundle.js",
		format: "iife",
		name: "ArticleExtractor",
		globals: {
			bellajs: "bellajs",
			"cross-fetch": "fetch",
			linkedom: "linkedom",
			"sanitize-html": "sanitizeHtml",
			"@mozilla/readability": "Readability",
		},
	},
	plugins: [resolve(), commonjs(), nodePolyfills()],
	external: ["cross-fetch"],
};
