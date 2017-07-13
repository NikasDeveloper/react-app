# react-simple-app

React app ready to be used for any purpose.

## Usage
```
git clone git@github.com:damianobarbati/react-simple-app.git
npm install -g yarn pm2
yarn install
yarn serve:dev //first terminal
yarn build:dev //second terminal to develop
yarn build:prod //second terminal to build for production
```

Define your bundles in the `package.json`.
Here a full reference:
```
"bundles": [
    {
        "name": "visitor", //bundle name: /build/:bundleName is going to host the bundle generated files
        "baseRoute": "/", //optional, see index.js for an example on how to use koa to automatically serve bundles which have a route defined
        "entry": "./apps/visitor/index.js", //the entry file for the bundle
        "vendor": [ //bundle dependencies: an ad-hoc dll is going to be created and bundled with the main bundle
            "axios",
            "react",
            "lodash-es",
        ],
        "htmlInput": "./apps/index.html" //the html file template to use: js and css files are going to be automatically added
        "vendorOutputFilename": "vendor.js", //optional: name for the ddl/vendor file created in the /build/:bundleName folder, default is vendor.js
        "bundleOutputFilename": "app.js", //optional: name for the bundle file created in the /build/:bundleName folder, default is app.js
        "cssOutputFilename": null, //optional: defining null is useful when using jss so no css file will be added to the html file, otherwise default is app.css
    },
    //other bundles
    {
        "name": "503",
        //no entry so just a html bundle is created
        "htmlInput": "./apps/503.html",
        "htmlOutputFilename": "./build/503.html"
    }
```

Defining your app logo in the `package.json` will trigger favicon automatic generation when building for production.
```
"logo": "./logo.svg",
```

## Next steps:
- babel 7: upgrade and remove decorator transform
- browserlist in package.json, used by: babel env, autoprefixer and koa to serve unsupported
- cordova bundle ready with conditional cordova.js (or dedicated chunk?)