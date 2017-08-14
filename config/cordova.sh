#!/usr/bin/env bash
rm -rf ./mobile/www/build && cp -r build ./mobile/www/build && cd ./mobile && cordova build ios && cordova emulate ios
cp build/user/index.html ./mobile/www/index.html
sed -i '' -e 's/<script/<script src="cordova.js"><\/script><script/' ./mobile/www/index.html
sed -i '' -e 's/src="\/build/src=".\/build/g' ./mobile/www/index.html
cordova build ios
cordova emulate ios