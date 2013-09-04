var zmq = require('zmq'),
    _   = require('lodash'),
    busybee = require('busybee');

busybee.init({ name : 'service_1' });

var conf = busybee.conf;

new busybee.cluster()
  .master(function () {
    // register the service
    var locator = new busybee.locator;
    locator.register(conf.app.name, conf.sockets.service);

    var conn = new busybee.brokerConnection(conf.sockets.broker.front, conf.sockets.broker.back, conf.app.name);
   })
  .worker(function () {
    var conn = new busybee.workerConnection(conf.sockets.worker);

    conn.responder.on('message', function(msg) {
      console.log('msg recieved: ' + msg);
      console.log(process.pid);
      res = new Object();
      res.data = 'data from service_1 on process: ' + process.pid + ' (node)';
      conn.responder.send(JSON.stringify(res));
    });
  });