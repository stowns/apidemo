var conf = busybee.conf,
    zmq = require('zmq'),
    _ = require('lodash'),
    async = require('async');

module.exports.applyTo = function(server, version) {
  server.get(version+'/:partner', call);  
}

// This would be its own module, leaving it here for now.
function call(req, res, next) {
  console.log('v1');

  if (!conf.partners[req.params.partner]) return res.send(404);
  // returns an array of services available to this partner per the conf
  var services = _.map(conf.partners[req.params.partner], function(service_name) {
    return conf.services[service_name];
  });

  // returns an array of zmq calls used by async
  var calls = _.map(services, function(service) {

    return function(cb) {
      new busybee.clientConnection(req.query.payload, service, cb);
    }

  });

  async.parallel(calls, function(err, results) {
    if (err) return res.send(err);

    res.send(_.map(results, function(value) { return JSON.parse(value).data }));
    next();
  });
  
}