const pkg = require('../package.json');

const webpack = require('webpack');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HardSourcePlugin = require('hard-source-webpack-plugin');
const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const ChunkHashPlugin = require('webpack-chunk-hash');
const CleanPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FaviconsPlugin = require('favicons-webpack-plugin');
const postcssAutoprefixer = require('autoprefixer');

const entries = pkg.bundles.filter(bundle => bundle.entry).reduce((reduced, bundle) => {
    reduced[`${bundle.name}/${bundle.entryOutputFilename || 'app'}`] = bundle.entry;
    return reduced;
}, {});

const entriesHtmlBundles = pkg.bundles.filter(bundle => bundle.htmlInput).map(bundle => (
    new HtmlPlugin({
        title: bundle.name,
        template: bundle.htmlInput,
        filename: bundle.htmlOutputFilename || `./build/${bundle.name}/index.html`,
        inject: true,
        chunks: [],
    })
));

const entriesHtmlBundlesAssets = pkg.bundles.filter(bundle => bundle.htmlInput).map(bundle => (
    new HtmlIncludeAssetsPlugin({
        assets: [
            `build/${bundle.name}/${bundle.vendorOutputFilename || 'vendor'}.js`,
            `build/${bundle.name}/${bundle.entryOutputFilename || 'app'}.js`,
            `build/${bundle.name}/${bundle.entryOutputFilename || 'app'}.css`,
        ],
        hash: true,
        append: true,
        files: bundle.htmlOutputFilename || `./build/${bundle.name}/index.html`,
    })
));

const dlls = pkg.bundles.filter(bundle => bundle.vendor).map(bundle => (
    new webpack.DllReferencePlugin({
        manifest: require(`../build/${bundle.name}/vendor.manifest.json`),
        name: `vendor`,
    })
));

const host = pkg[process.env.NODE_ENV] && pkg[process.env.NODE_ENV].host ? pkg[process.env.NODE_ENV].host.url : pkg.host.url;
const openBundles = pkg.bundles.filter(bundle => bundle.entry).map(bundle => (
    new OpenBrowserPlugin({
        url: `${host}${bundle.baseRoute}`,
    })
));

const webpackConfig = {
    entry: entries,
    output: {
        filename: `build/[name].js`,
        publicPath: '/',
    },
    resolve: {
        symlinks: false
    },
    profile: true,
    plugins: [
        new CaseSensitivePlugin(),
        new HardSourcePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new ChunkHashPlugin(),
        ...entriesHtmlBundles,
        ...entriesHtmlBundlesAssets,
        ...dlls,
        new ExtractTextPlugin({
            filename: `./build/[name].css`,
            ignoreOrder: true,
            allChunks: true,
        }),
        new NotifierPlugin({
            title: pkg.name,
            contentImage: pkg.logo,
            alwaysNotify: true,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: process.env.NODE_ENV === 'production',
            generateStatsFile: true,
            reportFilename: 'build/stats.html',
            statsFilename: 'build/stats.json',
        }),
        ...openBundles,
    ],
    module: {
        rules: [{
            test: /\.(js|mjs)$/i,
            exclude: filename => {
                if(!filename.includes('node_modules') || filename.includes('lodash'))
                    return false;
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
        },{
            test: /\.(js|mjs)$/i,
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
            }],
        },{
            test: /\.(css|scss|sass)$/i,
            loader: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 2,
                        camelCase: true,
                        localIdentName: '[name]-[local]',
                        minimize: process.env.NODE_ENV === 'development' ? false : { presets: 'default' },
                        sourceMap: true,
                    },
                },{
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            postcssAutoprefixer({ browsers: pkg.browserslist }),
                        ],
                        sourceMap: true,
                    },
                },{
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                }]
            }),
        },{
            test: /\.(woff|woff2|ttf|eot)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'build/assets/fonts/[name].[ext]?hash=[hash]',
                },
            }],
        },{
            test: /\.(jpg|jpeg|png|gif|svg)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    limit: 8192,
                    name: 'build/assets/images/[name].[ext]?hash=[hash]',
                },
            },{
                loader: 'img-loader',
                options: {
                    enabled: process.env.NODE_ENV === 'development' ? false : true,
                },
            }]
        },{
            test: /\.(json)$/i,
            use: [{
                loader: 'json-loader',
            }],
        }],
    }
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

    if(pkg.logo) {
        webpackConfig.plugins = [
            ...webpackConfig.plugins,
            new FaviconsPlugin({
                title: pkg.name,
                logo: pkg.logo,
                prefix: 'build/icons/',
                statsFilename: 'build/icons/stats.json',
                inject: true,
                emitStats: true,
                persistentCache: true,
                icons: {
                    favicons: true, android: true, appleIcon: true, appleStartup: true,
                    coast: false, firefox: false, opengraph: false, twitter: false, yandex: false, windows: false,
                },
            }),
        ];
    }
}

module.exports = webpackConfig;