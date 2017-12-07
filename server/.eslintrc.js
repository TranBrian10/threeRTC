module.exports = {
	"env": {
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
		"no-console": (process.env.NODE_ENV === 'production') ?
		[
			"error",
			{
				"allow": [
					"log",
					"warn",
					"error"
				]
			}
		] : "off",
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