var expect = require('chai').expect,
    request = require('request'),
    fs = require('fs'),
    app = require('../server').app;

describe('CDN', function () {
    var dirPackages = fs.realpathSync('./tools/packages');
    var hashFile = new Date().getTime() + '.js';
    var contentFile = "alert('simple javascript example " + hashFile + "');\n";
    var server = null;

    before(function (done) {
        if (!fs.existsSync(dirPackages + '/local-cdn-tests')) {
            fs.mkdirSync(dirPackages + '/local-cdn-tests');
            if (!fs.existsSync(dirPackages + '/local-cdn-tests/1.0.0')) {
                fs.mkdirSync(dirPackages + '/local-cdn-tests/1.0.0');
            }
        }

        fs.writeFileSync(dirPackages + '/local-cdn-tests/1.0.0/' + hashFile, contentFile);

        server = app.listen(9999);
        done();
    });

    after(function () {
        server.close();
    });

    it('should receive status code 200 and 304', function (done) {
        var etag = null;

        request.get('http://localhost:9999/vendors/local-cdn-tests/1.0.0/' + hashFile, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal(contentFile);
            etag = res.headers.etag;

            request.get({
                url: 'http://localhost:9999/vendors/local-cdn-tests/1.0.0/' + hashFile,
                headers: {
                    'If-None-Match': etag
                }
            }, function (err, res, body) {
                expect(res.statusCode).to.equal(304);
                expect(body).to.equal("");
                done();
            });
        });
    });
});