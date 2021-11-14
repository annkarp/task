const kafka = require('./');
const pool = require('../db_pool');
const { decodePayload } = require('./registry');

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
      if (message.key.toString() === 'AccountCreated') {
        const payload = await decodePayload(message.value);
        const { data: { public_id, username, role }} = payload;

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
