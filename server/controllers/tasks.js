const pool = require('../db_pool');
const sendToKafka = require('../kafka/producer');

module.exports.getAllTasks = async (req, res) => {
  try {
    const { userId } = req.query
    if (userId) {
      const data = await pool.query(
        `SELECT tasks.public_id, tasks.description, tasks.status, tasks.jira_id 
        FROM tasks WHERE account_id = $1 AND status = $2`,
        [userId, 'птичка в клетке'])

      const tasks = data.rows;
      res.status(200).json(tasks);
    } else {
      const data = await pool.query(
        `SELECT tasks.public_id, tasks.description, tasks.status, tasks.jira_id, users.username
         FROM tasks JOIN users ON tasks.account_id = users.public_id WHERE status = $1`,
        ['птичка в клетке']);

      const tasks = data.rows;
      res.status(200).json(tasks);
    }

  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports.createTask = async (req, res) => {
  try {
    let { description, id: account_id, status = 'птичка в клетке', jiraId: jira_id } = req.body;

    const task = await pool.query(
      `INSERT INTO tasks(description, status, account_id, jira_id) 
      VALUES($1, $2, $3, $4) RETURNING public_id;`,
      [description, status, account_id, jira_id ]);

    res.status(200).json(task.rows[0]);

    const message = { public_id: task.rows[0].public_id, description, status, account_id, jira_id };
    sendToKafka(message, 'TaskSaved')

  } catch (error) {
    console.log(error);
  }
};

module.exports.updateTask = async (req, res) => {
  try {
    let { id } = req.params;

    const data = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2;`,
      ['просо в миске', id]);

    const tasks = data.rows
    res.status(200).json(tasks);

  } catch (error) {
    console.log(error);
  }
};

module.exports.reassignTasks = async (req, res) => {
  try {
    const tasks = await pool.query(`SELECT * FROM tasks WHERE status = $1`, ['птичка в клетке']);
    const users = await pool.query(`SELECT * FROM users WHERE role = $1`, ['worker']);

    const assigningTask = async (task, workerId) => {
      await pool.query(
        `UPDATE tasks SET account_id = $1 WHERE public_id = $2;`,
        [workerId, task.public_id]);
    }

    if (tasks.rows.length > 0) {
      tasks.rows.forEach(task => {
        const index = Math.floor(Math.random() * (users.rows.length - 1 + 1) + 1)
        const workerId = users.rows[index - 1].public_id;
        assigningTask(task, workerId)
      })
    }

    res.status(200).json([]);

  } catch (error) {
    console.log(error);
  }
};
