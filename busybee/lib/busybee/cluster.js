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


  /** calls master() method w/ a cb */
  this.master(function () {
    console.log('Master process id ' + process.pid.toString());

    /** Default number of workers is the number of CPUs */
    var cpus        = require('os').cpus().length,
        numWorkers  = cluster.numWorkers || cpus;
    
    /** explicitly set worker number */
    cluster.workers(numWorkers);

    console.log('cluster: Spawning ' + numWorkers
              + ' workers for ' + cpus + ' CPUs');

    /** Restart workers when they die */
    cluster.sysCluster.on('exit', cluster.restartWorker);

    cluster.sysCluster.on('fork', function(worker) {
      console.log("worker " + worker.process.pid + " (#"+worker.id+") has spawned");
    });

    _.times(numWorkers, cluster.sysCluster.fork);
  });

  process.on('SIGUSR2', function(){  
    console.log("Signal: SIGUSR2");   
    console.log("swap out new workers one-by-one");   
    cluster.workerRestartArray = []; 
    
    for(var i in cluster.sysCluster.workers){    
      cluster.workerRestartArray.push(cluster.sysCluster.workers[i]);  
    }
   
    cluster.restartWorker();
  });

  this.worker(function() {
    process.on('message', function(msg) {
      if(msg == "stop"){
        process.send("stopping");
        process.exit();
      }
    });
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
  console.log('restartWorker called');
  var cluster = this;

  var workersRunning = 0;
  for (var i in cluster.sysCluster.workers){ workersRunning++; }

  console.log('numWorkers: ' + cluster.numWorkers);
  console.log('workersRunning: ' + workersRunning);
  if ( cluster.numWorkers > workersRunning ) {
    /* delayed to prevent CPU explosions if crashes happen to quickly */
    _.delay(function () {

      console.log('cluster: Worker ' + worker.id + ' (pid '
               + worker.process.pid + ') ' + 'died ('
               + worker.process.exitCode + '). Respawning..');

      cluster.sysCluster.fork();

    }, 100);
  } 

  console.log('workerRestartArray: ' + cluster.workerRestartArray);
  /* used for rolling restarts (SIGUSR2) */
  if (cluster.workerRestartArray.length > 0) {
    var worker = cluster.workerRestartArray.pop();
    // killing a worker will inturn call restartWorker and restart itself.
    worker.send("stop");
  }

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