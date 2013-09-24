module.exports = {
  app: {
    name : 'push_pull'
  },
  sockets: {
    push : 'tcp://*:5561',
    pull : 'tcp://localhost:5561'
  },
  store: {
    mongo: 'mongodb://localhost/push_pull',
    redis: 'redis://localhost:6379'
  },
  logger: {
    index:  {
      type : 'Mongo',
      levels : ['warn', 'error', 'fatal']
    }
  }
};