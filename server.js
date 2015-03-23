var express = require('express'),
    logger = require('morgan'),
    compression = require('compression'),
    memcache = require('memcache'),
    util = require('util'),
    cluster = require('cluster'),
    fs = require('fs'),
    app = module.exports.app = exports.app = express(),
    appCache = new memcache.Client(11211, '127.0.0.1');

app.disable('x-powered-by');
app.use(logger('dev'));
app.use(compression({
    level: 9
}));
app.use(function (req, res, next) {
    req.on('end', function () {
        var organization = req.params.organization,
            version = req.params.version,
            file = req.params.file;

        switch (res.statusCode) {
            case 200:
                util.debug(util.format('hit count +1 %s/%s/%s', organization, version, file));
                break;
            case 304:
                util.debug(util.format('hit cache count +1 %s/%s/%s', organization, version, file));
                break;
            case 404:
                util.debug(util.format('hit error count +1 %s/%s/%s', organization, version, file));
                break;
        }
    });
    next();
});

// Connect with memcached server
appCache.connect();

// Routes
const ROUTE_VENDORS = '/vendors/:organization([\\w_-]+)/:version(\\d\.\\d\.\\d)/:file([\\w\\_\\-\\.]+\.[a-z]{2,3})';
app.get(ROUTE_VENDORS, function (req, res) {
    var organization = req.params.organization,
        version = req.params.version,
        file = req.params.file,
        fullPathFile = util.format('/%s/%s/%s', organization, version, file),
        vendorFullPathFile = '/vendor' + fullPathFile,
        diskFullPathFile = 'tools/packages' + fullPathFile;

    appCache.get(vendorFullPathFile, function (err, result) {
        if (err || result === null) {
            fs.exists(diskFullPathFile, function (exists) {
                if (exists) {
                    fs.readFile(diskFullPathFile, function (err, data) {
                        if (!err) {
                            res.set('Content-Type', 'text/javascript');
                            res.send(data);
                            appCache.set(vendorFullPathFile, data);
                        } else {
                            res.sendStatus(404);
                        }
                    });
                } else {
                    res.sendStatus(404);
                }
            });
        } else {
            res.set('Content-Type', 'text/javascript');
            res.send(result);
        }
    });
});