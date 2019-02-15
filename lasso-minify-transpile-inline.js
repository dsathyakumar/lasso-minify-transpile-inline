'use strict';

const fs = require('fs');
const { promisify } = require('util');
const babel = require('babel-core');
const { get } = require('./get');
const readFileAsync = promisify(fs.readFile);


const DEPENDENCY_TYPE = 'minify-transpile-inline';
const DEPENDENCY_PROPS = {
    // Declare which properties can be passed to the dependency type
    properties: {
        'path': 'string',
        'inline': true,
        'type': 'string'
    },

    // Validation checks and initialization based on properties:
    async init(/* context */) {
        if (!this.path || !this.inline || !this.type || this.type !== DEPENDENCY_TYPE) {
            throw new Error('"path" is required');
        }

        // NOTE: resolvePath can be used to resolve a provided relative path to a full path
        this.path = this.resolvePath(this.path);
    },

    // Read the resource:
    async read(/* context */) {
        let src = await readFileAsync(this.path, { encoding: 'utf8' }) || '';
        if (src) {
            // filename is needed here until we bump to @babel/babel-core ^7
            src = babel.transform(src, {
                minified: true,
                comments: false,
                filename: this.path.substr(this.path.lastIndexOf('/') + 1)
            });
        }
        return get(src, 'code', '');
    },

    // getSourceFile is optional and is only used to determine the last modified time
    // stamp and to give the output file a reasonable name when bundling is disabled
    getSourceFile: function() {
        return this.path;
    }
};

module.exports = (lasso) => {
    lasso.dependencies.registerJavaScriptType(DEPENDENCY_TYPE, DEPENDENCY_PROPS);
};
