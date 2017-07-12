const pkg = require('./package.json');

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

const bundles = pkg.bundles.filter(bundle => ![null, undefined, '/'].includes(bundle.baseRoute));
for(let bundle of bundles) {
    router.all([bundle.baseRoute, `${bundle.baseRoute}/*`], async ctx => {
        await send(ctx, bundle.htmlFilename || `./build/${bundle.name}/index.html`, { root: __dirname });
    });
}

const defaultBundle = pkg.bundles.find(bundle => bundle.baseRoute === '/');
router.all('*', async ctx => {
    await send(ctx, defaultBundle.htmlFilename || `./build/${defaultBundle.name}/index.html`, { root: __dirname });
});

app.use(router.routes());

http.createServer(app.callback()).listen(pkg.host.httpPort || 80);

if(pkg.ssl) {
    let sslOptions = {
        key: fs.readFileSync(pkg.ssl.key),
        cert: fs.readFileSync(pkg.ssl.cert),
    };
    https.createServer(sslOptions, app.callback()).listen(pkg.host.httpsPort || 443);
}