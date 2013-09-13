var zmq = require('zmq'),
    _   = require('lodash'),
    busybee = require('busybee');

busybee.init({ name : 'service_1' });

/** busybee dependent */
var conf = busybee.conf,
    log = busybee.logger;

new busybee.cluster(conf)
  .master(function () {
    /** register the service */
    busybee.locator.register(conf.app.name, conf.sockets.service);

    var conn = new busybee.brokerConnection(conf.sockets.broker.front, conf.sockets.broker.back, conf.app.name);
   })
  .worker(function () {
    var conn = new busybee.workerConnection(conf.sockets.worker);

    conn.responder.on('message', function(msg) {
      log.info('msg recieved: ' + msg);
      var res = new Object();
      res.data = 'data from service_1 on process: ' + process.pid + ' (node) with payload ' + msg;
      conn.responder.send(JSON.stringify(res));
    });
  });