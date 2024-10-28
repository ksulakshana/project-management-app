const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../schema/user.schema');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
dotenv.config();

/***********************Register Code *************************** */

router.post(("/register"), async (req,res) => {
    try{
        const {name,email,password} = req.body;

        const ifUserExists = await User.findOne({email});
        if(ifUserExists){
            return res.status(200).json({message:"User Exists"});
        }
    
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({name,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message:"User Registered successfully"});
    }catch(e){
        return res.status(400).json({message:"error"});

    }
});

/***********************Login Code *************************** */

router.post('/login', async (req,res) => {

    try {
        const {email,password} = req.body;
        const ifUserExists = await User.findOne({email});
    
        if(!ifUserExists){
            return res.status(200).json({message:"Wrong email or password"});
        }
    
        const isPasswordMatch = bcrypt.compare(password,ifUserExists.password);
        if(!isPasswordMatch){
            return res.status(200).json({ message: "Wrong email or password" });
        }
    
        const payload = {id:ifUserExists._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET);
        res.status(200).json({token});
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
});

/*********************GET USER************* */
router.get('/',authMiddleware, async (req,res) => {
    try{
        const { user } = req;
        const userdata = await User.findById(user);
        res.status(200).json({userdata});
    }catch(e){
        res.status(500).json({"message":e.message});
    }
});

/*********************GET all users************* */
router.get('/allUsers',authMiddleware, async (req,res) => {
    try{
        const userdata = await User.find().select(`-password -__v`);
        res.status(200).json({userdata});
    }catch(e){
        res.status(500).json({"message":e.message});
    }
});
module.exports = router;
