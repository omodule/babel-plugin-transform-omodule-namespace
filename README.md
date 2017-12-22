# babel-plugin-transform-omodule-namespace
[![Build Status](https://travis-ci.org/omodule/babel-plugin-transform-omodule-namespace.svg?branch=master)](https://travis-ci.org/omodule/babel-plugin-transform-omodule-namespace) [![npm](https://img.shields.io/npm/v/babel-plugin-transform-omodule-namespace.svg)](https://www.npmjs.com/package/babel-plugin-transform-omodule-namespace)  
This is a babel plugin to transform [omodule structure](https://github.com/omodule/omodule) scope constants.

## Installation

```sh
$ npm install babel-plugin-transform-omodule-namespace --save-dev
```

## Configuration

#### .babelrc
```json
{
    "plugins": "transform-omodule-namespace"
}
```
#### Options
- `rootPath`: *(Default: project root)* - specify the root of omodule structure.
```json
{
    "plugins": [
        [
            "transform-omodule-namespace",
            { "rootPath": "./src" }
        ]
    ]
}
```

- `namespacePrefix`: *(Default: null)* - add a prefix to namespace.
```json
{
    "plugins": [
        [
            "transform-omodule-namespace",
            { "namespacePrefix": "/om" }
        ]
    ]
}
```
