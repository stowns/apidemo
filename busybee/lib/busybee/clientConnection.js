
var zmq = require('zmq'),
    _ = require('lodash'),
    ClientConn;

ClientConn = module.exports = function (service, cb) {
  this.init = function() {
    var _this = this;
    var timeoutStatus = true;
    var socket = zmq.socket('req'); // dealer is an async req but we don't need it since JS doesn't block :)
    socket.identity = 'client' + process.pid;
    console.log('locating');
    //_.bindAll(locator, 'service');
    var address = arguments[0] ? arguments[0] : locator.service(service.name);
    console.log(address);
    socket.connect(address);
    console.log('connected: ' + address);

    socket.send('do work');

    /** pretty ghetto.  we manually have to set timeouts for servics in the conf since there is no
        way to detect a failed req connection :( */
    _.delay(function() {
      if (timeoutStatus) {
        socket.close();
        console.log('service timed out at ' + address);

        /* prepare to handle unregistering the failed service */
        busybee.locator.on('unregistered', function(retryAddress) {
          // look for another service address
          if (retryAddress) {
            console.log('retrying ' + service.name + ':' + retryAddress);
            _this.init(retryAddress);
          } else {
            cb(new Error('timeout from ' + service.name + ':' + address), null);
          } 
        });
        
        // deregister this service location
        busybee.locator.deregister(service.name, location);       
      }
    }, service.timeout);

    socket.on('message', function(data) {
      timeoutStatus = false;
      console.log(data.toString());
      socket.close();

      cb(null, data);
    });
  }
  
  this.init();
}