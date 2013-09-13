module.exports = {
  app: {
    name : 'service_1'
  },
  sockets: {
    service : 'tcp://localhost:5559',
    broker : {
      front : 'tcp://*:5559',
      back : 'tcp://*:5560'
    },
    worker : 'tcp://localhost:5560'
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