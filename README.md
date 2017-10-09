# react-simple-app (to be soon renamed Yarsk)

React app ready to be used for any purpose.

Convention over configuration approach is adopted.
Handle everything through your `package.json` and never bother editing your `webpack.config.js` again.

#### Features:
- easy and configurable multiple bundles management: public website (/), private area (/user), back-office (/admin), etc
- babel 7, browserslist ad-hoc configuration
- koa
- react, redux, react-router-redux
- jss and theming

## Usage
```
git clone git@github.com:damianobarbati/react-app.git
npm install -g yarn pm2
yarn install
yarn serve:dev
yarn build:dev //or yarn build:prod to build for production
```
Almost no styling used at all but what needed to show theme capabilities.

## Configuration
Your `package.json` is the source of truth.
- `logo`: app logo filename, favicons will be automatically generated when building for production
- `browserslist`: supported browsers, babel will transpile just what's needed
- `locales`: supported locales, other moment libs will be trimmed out
- `host`: object containing hostname, httpPort and httpsPort, and full url for the app to be served; nest this in `NODE_ENV` to have environment scoping
- `bundles`: your bundles (i.e: visitor, user, admin) array

Quick reference for `host` (no environment scoping):
```
"host": {
    "url": "http://localhost:8080",
    "hostname": "localhost",
    "httpPort": 8080
},
```

Quick reference for `host` (with environment scoping):
```
"development": {
    "host": {
        "url": "https://dev.quant01.com:8081",
        "hostname": "dev.quant01.com",
        "httpPort": 8080,
        "httpsPort": 8081
    }
},
"staging": {
    "host": {
        "url": "https://stg.quant01.com",
        "hostname": "stg.quant01.com"
    }
},
"production": {
    "host": {
        "url": "https://www.quant01.com",
        "hostname": "www.quant01.com"
    }
},
```

Quick reference for `bundles`:
```
[
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
]
```

## Cordova

### install
```
cordova create mobile myapp.com myapp
cordova platform add ios android
cordova plugin add cordova-custom-config cordova-plugin-statusbar
cordova plugin add cordova-plugin-facebook --variable FACEBOOK_APP_ID=`jq -r .constants.auth.facebook.clientID ../package.json` --variable FACEBOOK_DISPLAY_NAME=`jq -r .name ../package.json`
cordova plugin add cordova-plugin-firebase

sh config/cordova.sh ./mobile ./build/user/index.html ios
sh config/cordova.sh ./mobile ./build/user/index.html android
```

### config.xml
```
<allow-navigation href="*" />

<preference name="Orientation" value="portrait" />
<preference name="DisallowOverscroll" value="true" />

<platform name="ios">
    <allow-intent href="itms:*" />
    <allow-intent href="itms-apps:*" />
    <config-file parent="UIStatusBarHidden" platform="ios" target="*-Info.plist">
        <true />
    </config-file>
    <config-file parent="UIViewControllerBasedStatusBarAppearance" platform="ios" target="*-Info.plist">
        <false />
    </config-file>
</platform>
```

### Xcode
Link your development team in Xcode after creating Cordova project.
When Xcode upgrades:
```
cd /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport
sudo ln -s 10.3.1\ \(14E8301\)/ 10.3.1
```

### AndroidStudio
help > edit custom props => add `idea.case.sensitive.fs=true`
To create an app hash for Facebook app:
```
keytool -exportcert -alias YourProjectName -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```