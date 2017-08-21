const pkg = require('../package.json');
const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabelMinifyPlugin = require('babili-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FaviconsPlugin = require('favicons-webpack-plugin');
const ShellPlugin = require('webpack-shell-plugin');

const happypack = true;

const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus(1).length - 1,
});

const entries = pkg.bundles.filter(bundle => bundle.entry).reduce((reduced, bundle) => {
    reduced[`${bundle.name}/${bundle.bundleOutputFilename || 'app'}`] = bundle.entry;
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

const entriesHtmlBundlesAssets = pkg.bundles.filter(bundle => bundle.htmlInput && bundle.entry).map(bundle => (
    new HtmlIncludeAssetsPlugin({
        assets: [
            ...(process.env.NODE_ENV === 'development' ? [`build/${bundle.name}/${bundle.vendorOutputFilename || 'vendor'}.js`] : []),
            `build/${bundle.name}/${bundle.bundleOutputFilename || 'app'}.js`,
        ],
        hash: true,
        append: true,
        files: bundle.htmlOutputFilename || `./build/${bundle.name}/index.html`,
    })
));

const dllsReferences = pkg.bundles.filter(bundle => bundle.vendor).map(bundle => (
    new webpack.DllReferencePlugin({
        manifest: `./build/${bundle.name}/vendor.manifest.json`,
        name: `vendor`,
    })
));

const host = pkg[process.env.NODE_ENV] && pkg[process.env.NODE_ENV].host ? pkg[process.env.NODE_ENV].host.url : pkg.host.url;
const openBundles = pkg.bundles.filter(bundle => bundle.entry).map(bundle => (
    new OpenBrowserPlugin({
        url: `${host}${bundle.baseRoute}`,
    })
));

const jsnextMainNotFound = filename => {
    if(!filename.includes('node_modules') || filename.includes('lodash'))
        return false;
    const packageFile = filename.replace(/(.+node_modules\/)(@.+?\/)?(.+?\/)(?:.+)?/, '$1$2$3package.json');
    const pkg = require(packageFile);
    return !pkg['jsnext:main'];
};

const jsLoaders = [{
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
}];

const cordovaBuilds = pkg.bundles.filter(bundle => bundle.cordova).map(bundle => {
    const htmlOutputFilename = bundle.htmlOutputFilename || `./build/${bundle.name}/index.html`;
    const build = `sh config/cordova.sh ${bundle.cordova} ${htmlOutputFilename}`;
    console.log(build);
    return build;
});

const happyPackJS = new HappyPack({
    id: 'js',
    threadPool: happyThreadPool,
    debug: true,
    verbose: true,
    loaders: jsLoaders,
});

const vendorEntries = pkg.bundles.filter(bundle => bundle.vendor).reduce((reduced, bundle) => {
    reduced[`${bundle.name}/${bundle.vendorOutputFilename || 'vendor'}`] = bundle.vendor;
    return reduced;
}, {});

const dlls = pkg.bundles.filter(bundle => bundle.vendor).map(bundle => (
    new webpack.DllPlugin({
        path: `build/[name].manifest.json`,
        name: `vendor`,
    })
));

const clean = new CleanPlugin(['./build'], {
    root: `${__dirname}/../`,
    verbose: true
});

const webpackVendorConfig = {
    name: 'dll',
    entry: vendorEntries,
    output: {
        publicPath: '/',
        path: path.resolve('./'),
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
        clean,
        ...dlls,
        ...(happypack ? [happyPackJS] : []),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: process.env.NODE_ENV === 'production',
            generateStatsFile: true,
            defaultSizes: 'gzip',
            reportFilename: 'build/vendor-stats.html',
            statsFilename: 'build/vendor-stats.json',
        }),
    ],
    module: {
        rules: [{
            test: /\.(js|mjs|jsx)$/i,
            exclude: jsnextMainNotFound,
            use: [ ...(happypack ? [{ loader: 'happypack/loader?id=js' }] : jsLoaders) ],
        }],
    },
};

const webpackConfig = {
    dependencies: process.env.NODE_ENV === 'development' ? ['dll'] : [],
    entry: entries,
    output: {
        publicPath: '/',
        path: path.resolve('./'),
        filename: `build/[name].js`,
    },
    resolve: {
        //modules: ['node_modules', path.resolve(__dirname, '../', 'node_modules')],
        //extensions: ['.js', '.mjs', '.jsx', '.json', '.*'],
        symlinks: false
    },
    profile: true,
    plugins: [
        ...(process.env.NODE_ENV === 'development' ? [] : [clean]),
        new CaseSensitivePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.ContextReplacementPlugin(/moment\/locale$/, new RegExp(pkg.momentLocales.join('|'))),
        ...entriesHtmlBundles,
        ...entriesHtmlBundlesAssets,
        ...(process.env.NODE_ENV === 'development' ? dllsReferences : []),
        new NotifierPlugin({
            title: pkg.name,
            contentImage: pkg.logo,
            alwaysNotify: true,
        }),
        ...(happypack ? [happyPackJS] : []),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: process.env.NODE_ENV === 'production',
            generateStatsFile: true,
            defaultSizes: 'gzip',
            reportFilename: 'build/stats.html',
            statsFilename: 'build/stats.json',
        }),
        ...openBundles,
        new ShellPlugin({ onBuildEnd: cordovaBuilds }),
    ],
    module: {
        rules: [{
            test: /\.(js|mjs|jsx)$/i,
            exclude: jsnextMainNotFound,
            use: [ ...(happypack ? [{ loader: 'happypack/loader?id=js' }] : jsLoaders) ],
        },{
            test: /\.(js|mjs|jsx)$/i,
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
            }],
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
    },
};

if(process.env.NODE_ENV === 'development') {
    webpackVendorConfig.devtool = webpackConfig.devtool = 'cheap-module-eval-sourcemap';
    webpackVendorConfig.output.pathinfo = webpackConfig.output.pathinfo = true;
    webpackConfig.watch = true;
}
else {
    webpackVendorConfig.devtool = webpackConfig.devtool = 'cheap-module-sourcemap';

    webpackVendorConfig.plugins = [
        ...webpackVendorConfig.plugins,
        new BabelMinifyPlugin(),
        new CompressionPlugin(),
    ];

    webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new BabelMinifyPlugin(),
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

module.exports = process.env.NODE_ENV === 'development' ? [webpackVendorConfig, webpackConfig] : webpackConfig;