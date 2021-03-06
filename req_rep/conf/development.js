module.exports = {
  app: {
    name : 'test'
  },
  sockets: {
    service : 'tcp://localhost:5561',
    bind : 'tcp://*:5563'
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