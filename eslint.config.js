import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        extends: [js.configs.recommended],
        rules: {
            "no-undef": "error",
            "no-unused-expressions": "error",
            eqeqeq: "off",
        },
        linterOptions: {
            reportUnusedDisableDirectives: "error",
            noInlineConfig: true,
        },
    },
]);
