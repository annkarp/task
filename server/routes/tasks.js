const Router = require('express').Router;
const tasksController = require('../controllers/tasks');
const validation = require('../middleware/validation');
const tasksRoute = Router();

tasksRoute.get('/', validation.tokenValidation, tasksController.getAllTasks);
tasksRoute.post('/', validation.tokenValidation, tasksController.createTask);
tasksRoute.post('/reassign', validation.tokenValidation, tasksController.reassignTasks);
tasksRoute.post('/:id', validation.tokenValidation, tasksController.updateTask);

module.exports = tasksRoute;
