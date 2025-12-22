const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom-error');

const getTasks = asyncWrapper( async (req, res) => {
    const tasks = await Task.find({});
    return res.status(200).json({ tasks });
})

const getTask =  asyncWrapper( async (req, res) => {
    const {id} = req.params ;
    const task = await Task.findById(id);
    if (!task){
        throw createCustomError('no task found with that id' , 404)
    }
    return res.status(200).json({ task });
})

const createTask = asyncWrapper( async (req, res) => {
    const task = await Task.create(req.body);
    return res.status(201).json({ task });
})

const deleteTask = asyncWrapper( async (req , res) => {
    const {id} = req.params ;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
        throw createCustomError(`no task with id ${id}`, 404);
    }
    return res.status(200).json({ task });
})


const updateTask = asyncWrapper( async (req , res) => {
    const {id} =  req.params ;
    const task = await Task.findByIdAndUpdate(id , req.body , { new : true , runValidators : true});
    if (!task) {
        throw createCustomError(`no task with id ${id}`, 404);
    }
    return res.status(200).json({ task });
})


module.exports = {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask
}



/*const createTask = (req, res) => {
    const {name , completed} = req.body
    if (!name) {
        res.status(400)
        .json({success : false , msg : "please provide name value"});
    }
    res.status(201).json({success : true , data : [...tasks , {id : tasks.length + 1 , name , completed}]});
}*/

/*const deleteTask = (req, res) => {
    const {id} = req.params ;
    const task = tasks.find((task) => task.id === Number(id));
    if (task) {
        const newtasks = tasks.filter((task) => task.id !== Number(id));
        return res.status(200).json({success : true , data : newtasks});
    }
    return res.status(404).json({success : false , msg : `no task with id ${id}`});
}*/

/*const updateTask = (req , res) => {
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
*/