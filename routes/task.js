const express = require('express');
const authMiddleware = require('../middleware/auth');
const { User } = require('../schema/user.schema');
const { Task } = require('../schema/task.schema');

const router = express.Router();

router.post('/', authMiddleware, async (req,res) => {

    try{
        const {title,priority,assignTo,assignToName,duedate,status,checklistData} = req.body;
        const { user } = req;

        let assignedTo = assignTo;

        if(assignedTo == '')
            assignedTo = user;

        const checklistdata = checklistData
        const task = new Task({ title, priority, assignTo: assignedTo, assignToName: assignToName, createdBy: user, dueDate:duedate, status, checklists : checklistdata });
        
        await task.save();
        res.status(200).json({ message: "Task created successfully" });
    
    }catch(e){
        console.log(e)
        res.status(400).json({ message: "Task not created" });
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
        const tasks = await Task.find({
            $or: [
              {
                createdBy: userdata._id
              },
              {
                assignTo: userdata._id
              }
            ]
          })
        res.status(200).json(tasks);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});

/******************get tasks count w.r.t createdBy User********** */
router.get('/count',authMiddleware,async (req,res) => {

    try{
        let { user } = req;
        const userdata = await User.findById(user).select(`_id`);
        const tasks = await Task.find({
            $or: [
              {
                createdBy: userdata._id
              },
              {
                assignTo: userdata._id
              }
            ]
          })
        res.status(200).json(tasks);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});
/******************update tasks - status********** */
router.put("/:id", authMiddleware, async (req, res) => {
    try{
        const { id } = req.params;

        let task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

         task = await Task.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(task);

    }catch(e){
        res.status(500).json({message : e.message});
    }
});


/*******************delete task********* */
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
})

module.exports = router;