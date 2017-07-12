const pkg = require('../package.json');
const webpack = require('webpack');

const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const bundle = pkg.bundles[0];

const entries = pkg.bundles.filter(bundle => bundle.vendor).reduce((reduced, bundle) => {
    reduced[`${bundle.name}/${bundle.vendorOutputFilename || 'vendor'}`] = bundle.vendor;
    return reduced;
}, {});

const dlls = pkg.bundles.filter(bundle => bundle.vendor).map(bundle => (
    new webpack.DllPlugin({
        path: `build/[name].manifest.json`,
        name: `vendor`,
    })
));

const webpackConfig = {
    entry: entries,
    output: {
        filename: `build/[name].js`,
        library: `vendor`,
    },
    profile: true,
    plugins: [
        new CaseSensitivePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CleanPlugin(['./build'], {
            root: `${__dirname}/../`,
            verbose: true
        }),
        ...dlls,
    ],
    module: {
        rules: [{
            test: /\.(js|mjs)$/i,
            exclude: filename => {
                const packageFile = filename.replace(/(.+node_modules\/)(@.+?\/)?(.+?\/)(?:.+)?/, '$1$2$3package.json');
                const pkg = require(packageFile);
                return !pkg['jsnext:main'];
            },
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },{
                loader: 'string-replace-loader',
                query: {
                    search: '.+?//@hide$',
                    flags: 'gim',
                    replace: '',
                },
            }],
        }],
    },
};

if(process.env.NODE_ENV === 'development') {
    webpackConfig.devtool = 'cheap-module-eval-sourcemap';
    webpackConfig.output.pathinfo = true;
}
else {
    webpackConfig.devtool = 'cheap-module-sourcemap';

    webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new BabiliPlugin(),
        new CompressionPlugin(),
    ];
}

module.exports = webpackConfig;