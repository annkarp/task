const kafka = require('./index')
const pool = require('../db_pool');

const consumer = kafka.consumer({
  groupId: 'task'
})

const main = async () => {
  await consumer.connect()

  await consumer.subscribe({
    topic: 'accounts-stream',
    fromBeginning: true
  })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.key.toString() === 'AccountRegistered') {
        const { public_id, username, role } = JSON.parse(message.value.toString());

        await pool.query(
          `INSERT INTO users(public_id, username, role) VALUES($1, $2, $3) RETURNING public_id;`,
          [public_id, username, role ]);
      }
    }
  })
}

main().catch(async error => {
  console.error(error)
  try {
    await consumer.disconnect()
  } catch (e) {
    console.error('Failed to gracefully disconnect consumer', e)
  }
  process.exit(1)
})
