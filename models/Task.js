const mongoose = require('mongoose');

var schema = new mongoose.Schema({  
    description : String,
    completed : String,
    deadline: Date
});

const Taskdb = mongoose.model('taskdb', schema);  

module.exports = Taskdb;