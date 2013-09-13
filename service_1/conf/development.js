module.exports = {
  app: {
    name : 'service_1'
  },
  sockets: {
    service : 'tcp://localhost:5559',
    broker: {
      front: 'tcp://*:5559',
      back: 'tcp://*:5560'
    },
    worker: 'tcp://localhost:5560'
  },
  store: {
    mongo: 'mongodb://localhost/service_1',
    redis: 'redis://localhost:6379'
  },
  logger: {
    index:  {
      type : 'Mongo',
      levels : ['warn', 'error', 'fatal']
    }
  }
};