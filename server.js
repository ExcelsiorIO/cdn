var express = require('express'),
    logger = require('morgan'),
    compression = require('compression'),
    memcache = require('memcache'),
    util = require('util'),
    cluster = require('cluster'),
    app = module.exports.app = exports.app = express(),
    appCache = new memcache.Client(11211, '127.0.0.1');

app.use(logger('dev'));
app.use(compression({
    level: 9
}));

// Connect with memcached server
appCache.connect();

// Routes
const ROUTE_VENDORS = '/vendors/:organization([\\w_-]+)/:version(\\d\.\\d\.\\d)/:file([\\w_-]+\.[a-z]{2,3})';
app.get(ROUTE_VENDORS, function (req, res) {
    var organization = req.params.organization,
        version = req.params.version,
        file = req.params.file,
        fullPathFile = util.format('/vendors/%s/%s/%s', organization, version, file);

    appCache.get(fullPathFile, function (err, result) {
        if (err || result === null) {
            res.send("alert(\'simple javascript example\');\n");
        } else {
            res.send("alert(\'simple javascript example\');\n");
        }
    });
});

app.get('/', function (req, res) {
    res.send('aasdasd');
});