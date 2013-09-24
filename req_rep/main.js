/*
* Req/Rep example
*
*/

var zmq = require('zmq'),
    _   = require('lodash'),
    busybee = require('busybee');

busybee.init({ name : 'test' });

/** busybee dependent */
var conf = busybee.conf,
    log = busybee.logger;

new busybee.cluster(conf)
  .master(function () {
    /** register the service */
    busybee.locator.register('test', conf.sockets.service);
    
    var reqHandler = function(err, req) {
      if (err) return log.error(err);

      log.info('msg recieved: ' + req.hello);
      var res = new Object();
      res.data = 'data on process: ' + process.pid + ' (node) with payload ' + req.hello;

      return res;
    }

    var conn = new busybee.connection.rep(conf.sockets.bind, reqHandler);
   })
  .worker(function () {
    _.delay(function() {
      var resHandler = function(err, response) {
        if (err) return log.error(err);

        console.log(response);
      }

      new busybee.connection.req({ payload : { hello : 'goodbye' }, 
                                   name : 'test',
                                   timeout : 3000}, resHandler);
    }, 1000);
  });