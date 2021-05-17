const restaurants = require('../models/restaurantModel')
// const jwt = require('jsonwebtoken')

const restaurantCtrl = {
    getInfo : async (req,res)=>{
        var id = req.params.id;
        
        if(!id){
            console.log(id);
            return res.status(400).json({msg: "Id of the restaurant not provided to show info!"})
        } 
        const restaurant = await restaurants.findOne({_id: id},(err, result)=>{
            if(err) return res.status(400).json({msg : err.msg})
            return result;
        })
        console.log(id)
        res.json(restaurant)
    },
    postInfo: async (req,res)=>{
        try {
            if(!req.body) return res.status(400).json({msg: "Nothing to post!"})
            const {name, email, category, description, contact, mainPhoto, menus, bestSeller, location} =  req.body

            const newRestaurant = new restaurants({name, email, category, description, contact, mainPhoto, menus, bestSeller, location})
            await newRestaurant.save()

            res.json({msg:"Detail about the restaurant posted successfully!"})
        } catch (err) {
            res.json({msg: err.msg})
        }

    },
    updateInfo: async (req,res)=>{
        const {id, name, photos, contactNumber, email, description, category, bestseller, location} =  req.body
        if(!id) return res.status(400).json({msg: "Please provide the id to process the update!"})
        await restaurants.findByIdAndUpdate(id, {$set : {name, photos, contactNumber,email, description,category,bestseller, location}}, (err,result)=>{
            if(err) return res.status(400).json(err.msg)
            return result;
        })
        res.json({msg: "Info about the restaurant updated successfully!"})
    },
    getAll : async (req,res)=>{
        try {
            const allRestaurants = await restaurants.find({}, {_id:1, name:1, location:1}, (err, result)=>{
                if(err){ return res.status(500).json({msg: err.msg})}
                return result;
            })
            res.json(allRestaurants)
        } catch (err) {
            return res.status(500).json({msg: err.msg})
        }
    },
    getSimilar: async(req,res)=>{
        try {
            const {id} = req.body
            const restaurant = await restaurants.findOne({_id: id}, {_id:0, category:1})
            
            const similar = await restaurants.find({
                category:{
                    $in : restaurant.category,
                },
                _id : {$ne: id},
            }, {_id:1, name:1, mainPhoto:1, location:1}, (err, result)=>{
                if(err) return res.status(400).json({msg: err.msg})
                return result;
            })
            res.json(similar)
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    }
}

module.exports = restaurantCtrl;