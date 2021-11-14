exports.up = pgm => {
  pgm.addColumns('tasks', {
    jira_id: { type: 'text', default: null },
  });
  pgm.createType('task_status', ['птичка в клетке', 'просо в миске']);
  pgm.alterColumn('tasks', 'status', {
    type: 'task_status'
  });
  pgm.sql(`UPDATE tasks SET status = 'просо в миске' WHERE status = 'done'`)
  pgm.sql(`UPDATE tasks SET status = 'птичка в клетке' WHERE status = 'not done'`)
};
