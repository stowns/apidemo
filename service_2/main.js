var zmq = require('zmq'),
    _   = require('lodash'),
    busybee = require('busybee');

busybee.init({ name : 'service_2' });

/** busybee dependent */
var conf = busybee.conf,
    log = busybee.logger;

new busybee.cluster(conf)
  .master(function () {
    /** register the service */
    busybee.locator.register(conf.app.name, conf.sockets.service);
    
    var conn = new busybee.connection.broker(conf.sockets.broker.front, conf.sockets.broker.back, conf.app.name);
   })
  .worker(function () {
    var reqHandler = function(err, req) {
      if (err) return log.error(err);
      log.info('msg recieved: ' + req);

      var res = new Object();
      res.data = 'service_2 data on process: ' + process.pid + ' (node) with payload ' + req;

      return res;
    }

    var conn = new busybee.connection.worker(conf.sockets.worker, reqHandler);
  });