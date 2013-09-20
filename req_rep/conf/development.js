module.exports = {
  app: {
    name : 'test'
  },
  sockets: {
    service : 'tcp://localhost:5561',
    broker: {
      front: 'tcp://*:5561',
      back: 'tcp://*:5562'
    },
    worker: 'tcp://localhost:5562'
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