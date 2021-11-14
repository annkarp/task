const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'auth',
  brokers: ['localhost:9092']
});

module.exports = kafka;
