const pkg = require('./package.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const koa = require('koa');
const cors = require('kcors');
const compress = require('koa-compress');
const noTrailingSlash = require('koa-no-trailing-slash');
const limit = require('koa-better-ratelimit');
const json = require('koa-json');
const body = require('koa-body');
const send = require('koa-send');
const sslify = require('koa-sslify');
const userAgent = require('koa-useragent');
const router = require('koa-router')();

const app = new koa();

app.use(cors());
app.use(compress());
app.use(noTrailingSlash());
app.use(limit({ duration: 1000, max: 20 }));
app.use(json({ pretty: true, spaces: 4 }));
app.use(body({ formLimit: '1mb', jsonLimit: '1mb', strict: false, multipart: true }));
app.use(userAgent);

const hostConfig = pkg.host[process.env.NODE_ENV] || pkg.host;
const sslConfig = (pkg.ssl && pkg.ssl[process.env.NODE_ENV]) || null;

if(sslConfig) {
    app.use(sslify({
        temporary: true,
        port: hostConfig.httpsPort || 443,
        redirectMethods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
    }));
}

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(error) {
        console.error(error);
        ctx.status = 400;
        ctx.body = error.message || error;
    }
});

const cacheHeaders = (res, path, stats) => {
    res.setHeader('Cache-Control', 'max-age=' + 3600 * 24 * 7);
};

router.all('/build*', async ctx => {
    await send(ctx, ctx.path, { root: __dirname, setHeaders: cacheHeaders });
});

const bundles = pkg.bundles.filter(bundle => ![null, undefined, '/'].includes(bundle.baseRoute));
for(const bundle of bundles) {
    router.all([bundle.baseRoute, `${bundle.baseRoute}/*`], async ctx => {
        await send(ctx, bundle.htmlOutputFilename || `./build/${bundle.name}/index.html`, { root: __dirname, setHeaders: cacheHeaders });
    });
}

const defaultBundle = pkg.bundles.find(bundle => bundle.baseRoute === '/');
router.all('*', async ctx => {
    await send(ctx, defaultBundle.htmlOutputFilename || `./build/${defaultBundle.name}/index.html`, { root: __dirname, setHeaders: cacheHeaders });
});

app.use(router.routes());

http.createServer(app.callback()).listen(hostConfig.httpPort || 80);

if(sslConfig) {
    const sslOptions = {
        key: fs.readFileSync(sslConfig.key),
        cert: fs.readFileSync(sslConfig.cert),
    };
    https.createServer(sslOptions, app.callback()).listen(hostConfig.httpsPort || 443);
}