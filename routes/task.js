const express = require('express');
const authMiddleware = require('../middleware/auth');
const { User } = require('../schema/user.schema');
const { Task } = require('../schema/task.schema');

const router = express.Router();

router.post('/', authMiddleware, async (req,res) => {

    try{
        const {title,priority,assignTo,dueDate,status,checklists} = req.body;
        const { user } = req;

        let assignedTo = assignTo;

        if(assignedTo == '')
            assignedTo = user;

        const checklistdata = checklists.split(",").map(checklist => checklist.trim());
        const task = new Task({ title, priority, assignTo: assignedTo, createdBy: user, dueDate, status, checklists : checklistdata });
    
        console.log(task);
    
        await task.save();
        res.status(200).json({ message: "Task created successfully" });
    
    }catch(e){
        console.log(e)
        res.status(400).json({ message: "Job not created" });
    }
});

/************get all posts ********************/
router.get('/all',authMiddleware,async (req,res) => {

    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});

/******************get tasks w.r.t createdBy User********** */
router.get('/',authMiddleware,async (req,res) => {

    try{
        let { user } = req;
        const userdata = await User.findById(user).select(`_id`);
        const tasks = await Task.find({"createdBy":userdata._id});
        res.status(200).json(tasks);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});

/******************get tasks w.r.t assignedTo User********** */
router.get('/assignedto',authMiddleware,async (req,res) => {

    try{
        let { user } = req;
        const userdata = await User.findById(user).select('_id');
        // console.log(userdata);
        const tasks = await Task.find({"assignTo":userdata._id});
        res.status(200).json(tasks);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});
module.exports = router;