module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "amd": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "array-bracket-spacing": [
            "error",
            "always"
        ],
        "brace-style": [
            "error",
            "stroustrup"
        ],
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "key-spacing": [
            "error"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error"
                ]
            }
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};