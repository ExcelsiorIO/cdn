var cluster = require('cluster');

var cpuCount = require('os').cpus().length;
var envCpuCount = process.env.CONCURRENCE_PROCESS || cpuCount;
if (envCpuCount > cpuCount) {
    envCpuCount = cpuCount;
}

if (cluster.isMaster && envCpuCount > 1) {
    for (var i = 0; i < envCpuCount; i++) {
        cluster.fork();
    }
} else {
    var util = require('util'),
        app = require('./server').app,
        port = process.env.PORT || 9999;

    app.listen(port);
    util.log('Server listen on ' + port);
}