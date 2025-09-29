const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Singup
router.post("/signup",async (req, res)=>{
    try{
const {email,password} = req.body;

const exitingUser = await User.findOne({where:{email}});
if(exitingUser) return res.status(400).json({message: "Email already exists"});

const hasedPassword = await bcrypt.hash(password,10);
await User.create({email,password:hasedPassword});

res.json({message:"USer registered successfully"});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }   
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "No user exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
