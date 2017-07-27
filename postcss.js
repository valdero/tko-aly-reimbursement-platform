const path = require('path');
const fs = require('fs');

const postcss = require('gulp-postcss');
const vfs = require('vinyl-fs');
const concat = require('gulp-concat');
const hash = require('gulp-hash');
const mkdirp = require('mkdirp');
const cssnext = require('postcss-cssnext');
const cssModule = require('postcss-modules');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

const dev = 'development';
const prod = 'production';
const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

const sources = [
    './node_modules/normalize.css/normalize.css',
    './src/client/**/*.css',
];
const outputDir = './public/';
const bundleName = 'style.css';

if (nodeEnv === prod) {
    const bundleStream = bundleCss();
    hashAndOutputToPublic(bundleStream);
} else {
    const bundleStream = bundleCss();
    outputToPublic(bundleStream);
}

function bundleCss() {
    return vfs.src(sources)
        .pipe(postcss(getPostcssPlugins()))
        .pipe(concat(bundleName));
}

function outputToPublic(bundleStream) {
    return bundleStream
        .pipe(vfs.dest(outputDir));
}

function hashAndOutputToPublic(bundleStream) {
    const hashedBundle = bundleStream
        .pipe(hash());

    outputToPublic(hashedBundle)
        .pipe(hash.manifest('style-manifest.json'))
        .pipe(vfs.dest('.'));
}

function getPostcssPlugins() {
    return [
        postcssImport({
            path: [
                'src/client/css',
            ],
        }),
        postcssFlexbugsFixes(),
        cssnext({
            browsers: 'last 2 versions, IE >= 10, iOS >= 7',
        }),
        cssModule({
            getJSON(id, classNameMappings) {
                const relativePath = path.relative('./src', id);
                const newPath = path.resolve('./dist', relativePath);
                const newFileName = newPath + '.json';
                mkdirp.sync(path.dirname(newFileName));
                // The styles are imported as default imports so the property 'default' needs to have all the exported data.
                // But to keep the rollup import simpler, we also want all of the style names on the top level too,
                // so well merge the style names object with an object that has them in a 'default' property.
                const jsonStructure = Object.assign({}, classNameMappings, { default: classNameMappings });
                fs.writeFileSync(newFileName, JSON.stringify(jsonStructure));
            },
            globalModulePaths: [
                /src\/client\/css\/common\.css/,
            ],
        }),
        onlyOnProd(() => cssnano({ safe: true })),
    ].filter(x => x !== undefined);
}

function parseNodeEnv(nodeEnv) {
    if (nodeEnv === prod || nodeEnv === dev) {
        return nodeEnv;
    }
    return dev;
}

function onlyOnProd(pluginConstructor) {
    return nodeEnv === prod
        ? pluginConstructor()
        : undefined;
}
