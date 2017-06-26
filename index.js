const config = require('./package.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const koa = require('koa');
const cors = require('kcors');
const compress = require('koa-compress')
const noTrailingSlash = require('koa-no-trailing-slash');
const json = require('koa-json');
const body = require('koa-body');
const send = require('koa-send');
const router = require('koa-router')();

const app = new koa();

app.use(cors());
app.use(compress());
app.use(noTrailingSlash());
app.use(json({ pretty: true, spaces: 4 }));
app.use(body({ formLimit: '5mb', jsonLimit: '5mb', strict: false, multipart: true }));

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(error) {
        ctx.status = 400;
        ctx.body = error.message || error;
    }
});

router.all('/ciao', async ctx => {
    ctx.body = null;
});

router.all('/build*', async ctx => {
    await send(ctx, ctx.path, { root: __dirname });
});

const routedBundles = config.bundles.filter(bundle => ![null, undefined, '/'].includes(bundle.baseRoute));
for(let bundle of routedBundles) {
    const bundleRoutes = [bundle.baseRoute, `${bundle.baseRoute}/*`];
    router.all(bundleRoutes, async ctx => {
        await send(ctx, bundle.htmlOutput, { root: __dirname });
    });
}

let defaultRoutedBundle = config.bundles.find(bundle => bundle.baseRoute === '/');
router.all('*', async ctx => {
    await send(ctx, defaultRoutedBundle.htmlOutput, { root: __dirname });
});

app.use(router.routes());

http.createServer(app.callback()).listen(config.host.httpPort || 80);

if(config.ssl) {
    let sslOptions = {
        key: fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert),
    };
    https.createServer(sslOptions, app.callback()).listen(config.host.httpsPort || 443);
}