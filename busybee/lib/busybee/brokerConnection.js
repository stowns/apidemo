var zmq = require('zmq'),
    Locator = require('./locator'),
    BrokerConn;

BrokerConn = module.exports = function (frontPort, backPort, appName) {
  var _this = this;
  this.frontend = zmq.socket('router');
  this.backend  = zmq.socket('dealer');
  console.log('Broker connecting to frontend: ' + frontPort);
  console.log('Broker connecting to backend: ' + backPort);
  this.frontend.bindSync(frontPort);
  this.backend.bindSync(backPort);

  // register
  //this.locator = new Locator(conf);
  //locator.register(appName, frontPort);

  this.frontend.on('message', function() {
    // Note that separate message parts come as function arguments.
    var args = Array.apply(null, arguments);
    // Pass array of strings/buffers to send multipart messages.
    _this.backend.send(args);
  });

  this.backend.on('message', function() {
    var args = Array.apply(null, arguments);
    _this.frontend.send(args);
  });
}