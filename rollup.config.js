import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import livereload from 'rollup-plugin-livereload';
import uglify from 'rollup-plugin-uglify';
import hash from 'rollup-plugin-hash';
import alias from 'rollup-plugin-alias';
import path from 'path';
import fs from 'fs';

const dev = 'development';
const prod = 'production';

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

const rollupPlugins = [
    resolveCssModuleExport(),
    replace({
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }),
    alias({
        // The resolve option lists all file suffixes that should be scanned for
        resolve: ['.ts', '.tsx', '/index.ts', '/index.tsx'],
        // The rest of the options are alias: real path mappings
        // The paths need to be absolute paths, that's why we use path.resolve
        // Note that this list needs to be duplicated in tsconfig.base.json and in
        // the package.json property _moduleAliases, but in those files the paths
        // need to be specified as relative paths from the project root
        client: path.resolve('./src/client'),
        server: path.resolve('./src/server'),
        common: path.resolve('./src/common'),
        // React-helmet provides an es6 module version, but doesn't advertise it in its package.json
        'react-helmet': path.resolve('./node_modules/react-helmet/es/Helmet'),
    }),
    nodeResolve({
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    }),
    commonjs({
        include: 'node_modules/**',
        namedExports: {
            'node_modules/prop-types/index.js': [
                'any',
                'array',
                'arrayOf',
                'bool',
                'element',
                'func',
                'instanceOf',
                'node',
                'number',
                'object',
                'objectOf',
                'oneOf',
                'oneOfType',
                'shape',
                'string',
                'symbol',
            ],
            'node_modules/marked/lib/marked.js': [
                'parse',
            ],
            'node_modules/ramda/index.js': [
                'Lens',
                'allPass',
                'always',
                'anyPass',
                'ascend',
                'complement',
                'contains',
                'dissoc',
                'equals',
                'filter',
                'find',
                'fromPairs',
                'head',
                'identity',
                'init',
                'KeyValuePair',
                'last',
                'lensPath',
                'lensProp',
                'map',
                'merge',
                'omit',
                'path',
                'pathOr',
                'pipe',
                'prop',
                'propEq',
                'set',
                'sortBy',
                'sortWith',
                'tail',
                'uniqBy',
                'view',
                'zipWith'
            ],
            'node_modules/react-dom/index.js': [
                'render',
            ],
            'node_modules/react-helmet/lib/Helmet.js': [
                'Helmet',
            ],
            'node_modules/react/react.js': [
                'Component',
                'createElement',
            ],
        },
    }),
    typescriptPlugin({
        typescript,
        tsconfig: 'tsconfig.json',
        importHelpers: true,
    }),
];


if (nodeEnv === dev) {
    rollupPlugins.push(livereload());
}
if (nodeEnv === prod) {
    rollupPlugins.push(uglify());
    rollupPlugins.push(hash({
        dest: './public/bundle-[hash].js',
        replace: false,
        manifest: './bundle-manifest.json',
    }));
}

export default {
    plugins: rollupPlugins,
    sourceMap: nodeEnv === dev ? 'inline' : false,
    entry: './src/client/main.tsx',
    dest: './public/bundle.js',
    format: 'iife',
};

function parseNodeEnv(nodeEnv) {
    if (nodeEnv === prod || nodeEnv === dev) {
        return nodeEnv;
    }
    return dev;
}

function resolveCssModuleExport() {
    return {
        transform(code, id) {
            if (path.extname(id) !== '.css') {
                return null;
            }

            try {
                const relativePath = path.relative('./src', id);
                const newPath = path.resolve('./dist', relativePath);
                const newFileName = newPath + '.json';
                const json = fs.readFileSync(newFileName);

                return {
                    code: `export default ${json};`,
                    map: { mappings: '' },
                };
            } catch (e) {
                return {
                    code: 'export default {}',
                    map: { mappings: '' },
                };
            }
        },
    };
}
