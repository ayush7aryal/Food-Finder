const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req,res)=>{
        try{
            const {firstName, lastName, email, phone, password} = req.body;
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "User already exists"})
            if(password.length < 8 ) return res.status(400).json({msg: "Password must be of at least 8 characters"})

            const encrypted_pass = await bcrypt.hash(password, 10)

            const newUser = new Users({firstName, lastName, email, phone, password: encrypted_pass})
            await newUser.save();

            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshToken',
                maxAge: 7*24*60*60*1000 // 7d
            })
            res.json({accesstoken : accesstoken})
            // res.json({msg: "Registered successfully!"})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
        
    },
    login: async (req,res)=>{
        try{

            const {email, password} = req.body;
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"No match found. Register first"})
            if(!await bcrypt.compare(password, user.password)){
                return res.status(400).json({msg: "Wrong password!"})
            }

            //Login success so creating web tokens
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshToken',
                maxAge: 7*24*60*60*1000 // 7d
            })
            res.json("Logged in successfully!")

        }catch(err){
            return res.status(500).json({msg: err.message})
        }

    },
    logout: async (req,res)=>{
        try{

            res.clearCookie('refreshtoken', {path: '/user/refreshToken'})
            return res.json({msg: "Logged out successfully!"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: (req,res)=>{
        try{
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "User not authenticated"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user)=>{
                if(err) return res.status(400).json({msg: "User not authenticated!"})
                const accesstoken = createAccessToken({id: user.id})
                res.json({accesstoken})
            })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req,res)=>{
        try{
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User not found!"})
            res.json(user)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    roleChange: async(req,res)=>{
        try {
            await Users.findByIdAndUpdate(req.body.email, {$set :{role : 1}})
            res.json({msg: "Updated successfully!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async(req,res)=>{
        try {
            const {email} = req.body
            await Users.remove({email: email})
            res.json({msg: "User deleted successfully"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user)=>{
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '12h'})
}

const createRefreshToken = (user)=>{
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
}

module.exports = userCtrl;