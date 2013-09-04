var conf = busybee.conf,
    zmq = require('zmq'),
    _ = require('lodash'),
    async = require('async');


module.exports.applyTo = function(server, version) {
  server.get(version+'/:partner', call);  
}

// This would be it's own module, leaving it here for now.
function call(req, res, next) {
  res.send('its not ready yet :(');
  next();
}