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
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
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
        "brace-style": [
            "error",
            "stroustrup"
        ],
        "no-trailing-spaces": [
            "error"
        ]
    }
};