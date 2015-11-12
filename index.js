require('babel-core/register')({
    sourceMaps: true
});
require('source-map-support').install();

const app = require('./app');