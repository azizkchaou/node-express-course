//let {tasks} = require('../data/tasks');
const Task = require('../models/Task');

const getTasks = (req ,res) => {
    res.json(tasks);
}
/*const createTask = (req, res) => {
    const {name , completed} = req.body
    if (!name) {
        res.status(400)
        .json({success : false , msg : "please provide name value"});
    }
    res.status(201).json({success : true , data : [...tasks , {id : tasks.length + 1 , name , completed}]});
}
*/
const createTask = async (req , res) => {
    const task =  await Task.create(req.body);
    res.status(201).json({success : true , data : task});
}


const getTask = (req, res) => {
    const {id} = req.params ;
    const task = tasks.find((task) => task.id === Number(id));
    if (!task) {
        return res.status(404).json({success : false , msg : `no task with id ${id}`});
    }
    return res.status(200).json({success : true , data : task});
}

const deleteTask = (req, res) => {
    const {id} = req.params ;
    const task = tasks.find((task) => task.id === Number(id));
    if (task) {
        const newtasks = tasks.filter((task) => task.id !== Number(id));
        return res.status(200).json({success : true , data : newtasks});
    }
    return res.status(404).json({success : false , msg : `no task with id ${id}`});
}

const updateTask = (req , res) => {
    const {id} = req.params ;
    const {name, completed} = req.body ;
    const task = tasks.find((task) => task.id === Number(id));
    if(!task) {
        return res.status(404).json({success : false , msg : `no task with id ${id}`});
    }
    const newtasks = tasks.map((task) => {
        if (task.id === Number(id)) {
            if (name !== undefined) {
                task.name = name;
            }
            if (completed !== undefined) {
                task.completed = completed;
            }
        }
        return task;
    });
    
    return res.status(200)
    .json({success : true , data : newtasks});
}

module.exports = {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask
}
