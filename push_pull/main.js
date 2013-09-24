/*
* Req/Rep example
*
*/

var zmq = require('zmq'),
    _   = require('lodash'),
    busybee = require('busybee');

busybee.init({ name : 'push_pull' });

// busybee dependent
var conf = busybee.conf,
    log = busybee.logger;

new busybee.cluster(conf)
  .master(function () {    
    // register the service
    busybee.locator.register('push_pull', conf.sockets.pull);
    
    // we need a reference to a Push connection prior to binding
    // so that we can first prepare out event handlers
    var conn = new busybee.connection.push();
    
    conn.on('error', function(err) {
      return log.error(err);
    });

    conn.on('ready', function() {
      // messages pushed will not be recieved by req sockets unless they have connected
      setTimeout(function() {
        conn.send({ hello : 'hello' });
      }, 3000);
    });

    // now bind!
    conn.bind(conf.sockets.push);
   })
  .worker(function () {
    var reqHandler = function(err, data) {
      if (err) return log.error(err);

      log.info(data);
    };

    // the push socket takes a second to register itself so we need
    // to wait a couple of seconds to be safe before connecting
    setTimeout(function() {
      new busybee.connection.pull('push_pull', reqHandler);
    }, 2000)
  });