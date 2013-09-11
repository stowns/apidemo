/**
 * apidemo
 *
 * @author Simon Townsend <stowns3@gmail.com>
 */

var versions = require('./lib/versions'),
    zmq      = require('zmq'),
    _        = require('lodash'),
    async    = require('async'),
    restify  = require('restify');

var busybee  = require('busybee');
busybee.init({ name : 'api' });

/** dependencies */
var conf    = busybee.conf,
    server;

/** server attachment */
server = restify.createServer({
  name:       conf.app.name,
  version:    conf.api.defaultVersion,
  acceptable: conf.server.acceptable
});

server.pre([
  restify.authorizationParser(),
]);

server.use([
  restify.queryParser(),
  restify.bodyParser(),
  restify.acceptParser(server.acceptable),
  restify.throttle({
    rate:     conf.server.throttleRate,
    burst:    conf.server.throttleBurst,
    ip:       false,
    username: true
  }),
  restify.gzipResponse()
]);

// route to display versions
server.get('/', function(req, res) {
    res.json(versions);
})

// versioned routes go in the adapters/ directory
// import the routes
for (var k in versions) { 
  adapter = require('./adapters' + versions[k]);
  adapter.applyTo(server, versions[k]);
}

// handle errors
// process.on('uncaughtException', function (exception) {
//   console.log('AppError: ' + exception);
// });

// kick off the cluster
new busybee.cluster()
  .master(function () { })
  .worker(function () { server.listen(8080); });

module.exports = server;