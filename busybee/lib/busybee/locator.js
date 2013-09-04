var redis = require("redis"),
    client = redis.createClient(),
    sub = redis.createClient(), 
    _ = require('lodash'),
    events = require('events'),
    Locator;

/**
 * @constructor
 */
Locator = module.exports = function() {
  _.bindAll(this);
  
  /* call EventEmitter constructor */
  events.EventEmitter.call(this);

  process.nextTick(this.start);

  return this;
}

Locator.prototype.__proto__ = events.EventEmitter.prototype;

Locator.prototype.start = _.once(function() {
  console.log('SHITS STARTED');

  var _this = this;

  /* fetch current service list */
  this.fetch(function(services) {
    _this.services = services;
  });

  sub.on("subscribe", function (channel, count) {
      console.log('listening for service updates');
  });

  /* parse any incoming messages */
  sub.on("message", function (channel, serviceList) {
   
   var services = JSON.parse(serviceList);
   console.log('services updated ' + services);
   
   _this.services = services;
  });

   /* subscribe for service updates */
  sub.subscribe("service-update");

  return this;
});

/**
 * Returns the ip of a named service
 *
 * @param {String} name of a service
 */
Locator.prototype.service = function(serviceName) {
  console.log('services');
  console.log(this.services);
  var s = this.services[serviceName].shift();
  // move the returned service to the back of the stack (fair-que)
  this.services[serviceName].push(s);
  
  return s; 
}

/**
 * Registers a new service
 *
 * @param {String} name of the service
 * @param {String} ip address of the service
 */
Locator.prototype.register = function(serviceName, address) {
  client.multi()
        .sadd("services", serviceName + "|" + address)
        .smembers("services")
        .exec(function(err, reply) {
          // publish new list to redis
          console.log("reply");
          console.log(reply);
          client.publish("service-update", JSON.stringify(reply[1]));
        });
}

/**
 * Removes a service from the registry
 *
 * @param {String} name of the service
 * @param {String} ip address of the service
 */
Locator.prototype.deregister = function(serviceName, address) {
  // set (remove)
  client.multi()
        .sremove("services", serviceName + "|" + address)
        .smembers("services")
        .exec(function(err, reply) {
          // publish new list to redis
          console.log("reply");
          console.log(reply);
          client.publish("service-update", JSON.stringify(reply[1]));
        });
}

/**
 * Returns a services object
 */
Locator.prototype.fetch = function(cb) {
  client.smembers("services", function(err, serviceList) {
    cb(parseServiceList(serviceList));
  });
}

function parseServiceList(serviceList) {
  var services = {};
  
  /* build up a services object from an incoming update */
  serviceList.forEach(function(s) {
    var service = s.split("|");
    services[service[0]] = _.isUndefined(services[service[0]])
                           ? services[service[0]] = [service[1]]
                           : services[service[0]].push(service[1]);
  });

  console.log('parsed');
  console.log(services);
  
  return services;
}