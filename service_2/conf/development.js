module.exports = {
  app: {
    name: 'service_2'
  },
  sockets: {
    service: 'tcp://localhost:5563',
    broker: {
      front: 'tcp://*:5563',
      back: 'tcp://*:5564'
    },
    worker: 'tcp://localhost:5564'
  },
  store: {
    mongo: 'mongodb://localhost/service_2',
    redis: 'redis://localhost:6379'
  },
  logger: {
    index:  {
      type: 'Mongo',
      levels: ['warn', 'error', 'fatal']
    }
  }
};