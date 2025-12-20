const express = require('express');
const router  = express.Router();
const { getTasks,getTask , createTask, deleteTask, updateTask } = require('../controllers/tasks');

/*router.get('/' , getTasks)
router.post('/' , createTask)
router.get('/:id' , getTask)
router.delete('/:id', deleteTask )
router.patch('/:id' , updateTask) 
*/
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).delete(deleteTask).patch(updateTask);


module.exports = router ;