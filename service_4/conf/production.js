module.exports = {
  app: {
    name : 'service_1'
  },
  sockets: {
    service : 'tcp://localhost:5561',
    broker : {
      front : 'tcp://*:5561',
      back : 'tcp://*:5562'
    },
    worker : 'tcp://localhost:5562'
  },
  store: {
    mongo: process.env.MONGOHQ_URL,
    redis: process.env.REDISTOGO_URL
  },
  logger: {
    index:  {
      type : 'Mongo',
      levels : ['warn', 'error', 'fatal']
    }
  }
};