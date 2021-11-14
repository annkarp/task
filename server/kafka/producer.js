const kafka = require('./index')

const producer = kafka.producer();

const main = async () => {
  await producer.connect()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

module.exports = producer;
