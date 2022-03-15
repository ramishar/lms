const axios = require('axios');

const Taskdb = require('../models/Task');

module.exports.tasks_get = (req, res) => {
    axios.get('http://localhost:3000/api/tasks')
    .then(function(response){
        res.render('tasks', { tasks : response.data });
    })
    .catch(err =>{
        res.send(err);
    })
}

module.exports.add_task = (req, res) => {
    res.render('add_task');
}

module.exports.update_task = (req, res) => {
    axios.get('http://localhost:3000/api/tasks', { params : { id : req.query.id }})
    .then(function(taskdata){
        res.render("update_task", { task : taskdata.data})
    })
    .catch(err =>{
        res.send(err);
    })
}

// create and save new task
module.exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

    // new task
    const task = new Taskdb({
        description : req.body.description,
        completed : req.body.completed,
        deadline : req.body.deadline
    })

    // save task in the database
    task
        .save(task)
        .then(data => {
            //res.send(data)
            res.redirect('/add_task');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// retrieve and return all tasks/ retrive and return a single task
module.exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Taskdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found task with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving task with id " + id})
            })

    }else{
        Taskdb.find()
            .then(task => {
                res.send(task)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving task information" })
            })
    }

    
}

// Update a new idetified task by task id
module.exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Taskdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update task with ${id}. Maybe task not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error updating task information"})
        })
}

// Delete a task with specified id in the request
module.exports.delete = (req, res)=>{
    const id = req.params.id;

    Taskdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Task was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Task with id=" + id
            });
        });
}