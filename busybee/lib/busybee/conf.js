var cluster    = require('cluster'),
    _          = require('lodash'),
    Conf;

function Conf() {
  _.bindAll(this);

  return this;
}

/**
 * Retrieves the configuration
 *
 * @param {options} name of app conf to load or specfic path
 * @return this
 */
Conf.prototype.retrieve = function(options) {
  var configuration = options.path || require('/etc/busybee/' + options.name + '/' + (process.env.NODE_ENV || 'development'));

  if (cluster.isWorker) {
    configuration.name = options.name + '.worker.' + cluster.worker.id;
  }

  /** define a property for each key in the loaded conf */
  for (var prop in configuration) {
    Object.defineProperty(this, prop, {
      value : configuration[prop]
    });
  }
  
  return this
}

module.exports = new Conf();