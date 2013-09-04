/**
 * Runs an application process in master-worker arrangement to
 * the maximum number of available CPUs.
 */

var _          = require('lodash'),
    Cluster;

/**
 * @constructor
 */
Cluster = module.exports = function () {

  _.bindAll(this);

  process.nextTick(this.start);

  return this;

};

/** @property {Native Cluster} sysCluster Node's cluster module */
/** @alias {Cluster.prototype.sysCluster} onto Cluster constructor for static ref */
Cluster.prototype.sysCluster = Cluster.sysCluster = require('cluster');

/**
 * Starts the cluster
 */
Cluster.prototype.start = _.once(function () {

  var cluster = this;

  // calls master() method w/ a cb
  this.master(function () {
    // intialize broker if applicable
    
    // Default number of workers is the number of CPUs
    var cpus        = require('os').cpus().length,
        numWorkers  = cluster.numWorkers || cpus;

    console.log('cluster: Spawning ' + numWorkers
              + ' workers for ' + cpus + ' CPUs');

    _.times(numWorkers, cluster.sysCluster.fork);

    // Restart workers when they die
    cluster.sysCluster.on('exit', cluster.restartWorker);

  });

  return this;

});

/**
 * Restarts a dead worker
 *
 * @private
 * @param {cluster.worker} worker worker that died
 * @param {Number} code Exit code of dead worker
 * @param {String} signal The signal that killed the worker
 */
Cluster.prototype.restartWorker = function (worker, code, signal) {

  var cluster = this;

  _.delay(function () {

    console.log('cluster: Worker ' + worker.id + ' (pid '
             + worker.process.pid + ') ' + 'died ('
             + worker.process.exitCode + '). Respawning..');

    cluster.sysCluster.fork();

  }, 10);

};

/**
 * Sets the number of workers we are to spawn
 *
 * @param {Number} numWorkers How many workers shall we spawn?
 * @return this
 */
Cluster.prototype.workers = function (numWorkers) {

  this.numWorkers = numWorkers;

  return this;

};

/**
 * Executes code on a master process
 *
 * @param {Function} cb Callback to be run if we are in a master process
 */
Cluster.prototype.master = function (cb) {

  if (this.sysCluster.isMaster && cb instanceof Function) cb();

  return this;

};

/**
 * Executes code on a worker process
 *
 * @param {Function} cb Callback to be run if we are in a worker process
 */
Cluster.prototype.worker = function (cb) {

  if (this.sysCluster.isWorker && cb instanceof Function) cb();

  return this;

};

/**
 * Executes code on both processes
 *
 * @param {Function} cb Callback to be run
 */
Cluster.prototype.shared = function (cb) {

  if (typeof cb === 'function') cb();

  return this;

};
