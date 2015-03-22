var expect = require('chai').expect,
    request = require('request'),
    app = require('../server').app;

describe('CDN', function () {
    var url = 'http://localhost:9999';
    var exampleContent = "alert(\'simple javascript example\');\n";
    var server = null;

    before(function (done) {
        server = app.listen(9999);
        done();
    });

    after(function () {
        server.close();
    });

    it('should receive status code 200 with asset content', function (done) {
        request.get('http://localhost:9999/vendors/example/0.0.0/example.js', function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal(exampleContent);
            done();
        });
    });

    it('should receive status code 200 with assets content', function (done) {
        request.get('http://localhost:9999/vendors/example/v0.0.0/example.js', function (err, res, body) {
            expect(res.statusCode).to.equal(404);
            expect(body).to.contain("Cannot GET /vendors/example/v0.0.0/example.js");
            done();
        });
    });
});