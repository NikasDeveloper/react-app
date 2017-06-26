const config = require('../package.json');

const webpack = require('webpack');
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

const entries = config.bundles.reduce((reduced, bundle) => {
    if(bundle.entry)
        reduced[`${bundle.name}/${bundle.entryOutputFilename}`] = bundle.entry;
    if(bundle.vendor)
        reduced[`${bundle.name}/${bundle.vendorOutputFilename}`] = bundle.vendor;
    return reduced;
}, {});

const entriesChunks = config.bundles.filter(bundle => bundle.vendor).map(bundle => (
    new webpack.optimize.CommonsChunkPlugin({
        name: `${bundle.name}/${bundle.vendorOutputFilename}`,
        chunks: [`${bundle.name}/${bundle.vendorOutputFilename}`, `${bundle.name}/${bundle.entryOutputFilename}`],
        minChunks: Infinity,
    })
));

const entriesHtmlBundles = config.bundles.filter(bundle => bundle.htmlInput).map(bundle => {
    let chunks = [];

    if(bundle.entry) {
        chunks.push(`${bundle.name}/${bundle.entryOutputFilename}`);
    }
    if(bundle.vendor) {
        chunks.push(`${bundle.name}/${bundle.vendorOutputFilename}`);
        chunks.push('manifest');
    }

    const htmlBundle = new HtmlPlugin({
        title: bundle.name,
        chunks,
        template: bundle.htmlInput,
        filename: bundle.htmlOutput,
        hash: process.env.NODE_ENV === 'development', //broken since it uses hash instead of chunkhash (remove chunkhash once fixed) used on dev for now to not cache
        inject: true,
        cache: true,
    });
    return htmlBundle;
});

const host = config[process.env.NODE_ENV] && config[process.env.NODE_ENV].host ? config[process.env.NODE_ENV].host.url : config.host.url;
const openBundles = config.bundles.filter(bundle => bundle.entry).map(bundle => (
    new OpenBrowserPlugin({
        url: `${host}${bundle.baseRoute}`,
    })
));

const webpackConfig = {
    entry: entries,
    output: {
        filename: `build/[name].${process.env.NODE_ENV === 'development' ? '' : '[chunkhash].'}min.js`,
        chunkFilename: `build/[name].${process.env.NODE_ENV === 'development' ? '' : '[chunkhash].'}min.js`,
        publicPath: '/',
    },
    plugins: [
        ...entriesHtmlBundles,
        new CaseSensitivePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        ...entriesChunks,
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new ChunkHashPlugin(),
        new CleanPlugin(['./build'], {
            root: `${__dirname}/../`,
            verbose: true
        }),
        new StyleLintPlugin(),
        new ExtractTextPlugin({
            filename: `./build/[name].${process.env.NODE_ENV === 'development' ? '' : '[contenthash].'}min.css`,
            ignoreOrder: true,
            allChunks: true,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: process.env.NODE_ENV === 'production',
            generateStatsFile: true,
            reportFilename: 'build/stats.html',
            statsFilename: 'build/stats.json',
        }),
        new NotifierPlugin({
            title: config.name,
            contentImage: './logo.svg',
            alwaysNotify: true,
        }),
        ...openBundles,
    ],
    module: {
        rules: [{
            test: /\.(js|mjs)$/i,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
            },{
                loader: 'eslint-loader',
            },{
                loader: 'string-replace-loader',
                query: {
                    search: '.+?//@hide$',
                    flags: 'gim',
                    replace: '',
                },
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
                            postcssAutoprefixer({ browsers: config.browserslist }),
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
    webpackConfig.devtool = 'inline-source-map';
}
else {
    webpackConfig.devtool = 'source-map';

    webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new BabiliPlugin(),
        new CompressionPlugin(),
    ];

    if(config.logo) {
        webpackConfig.plugins = [
            ...webpackConfig.plugins,
            new FaviconsPlugin({
                title: config.name,
                logo: config.logo,
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