const service = require('../api/main');

const bin = module.exports = {};
for(const key in service)
    bin[key] = service[key];

require('binize')(bin);