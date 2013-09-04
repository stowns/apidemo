var zmq = require('zmq'),
    WorkerConn;

WorkerConn = module.exports = function (port) {
  this.responder = zmq.socket('rep');
  console.log('Worker Connecting to:' + port);
  this.responder.connect(port);
}

