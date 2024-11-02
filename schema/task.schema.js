const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require("./user.schema");

const taskSchema = new Schema ({
    title:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true,
        enum:["HIGH PRIORITY","MODERATE PRIORITY","LOW PRIORITY"]
    },
    assignTo:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:false
    },
    assignToName:{
        type:String,
        required:false
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:User
    },
    createdDate:{
        type: Date,
        default: Date.now
    },
    dueDate:{
        type: Date,
        required:false
    },
    status:{
        type:String,
        required:true,
        default: "To-Do"
    },
    checklists:{
        type: [Array],
        required:true,
    }
})

const Task = mongoose.model('Task',taskSchema);
module.exports = { Task };