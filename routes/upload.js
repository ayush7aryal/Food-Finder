const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

//upload on cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

router.post('/upload', async (req, res)=>{
    try {
        const {fileStr, id} = req.body
        await cloudinary.v2.uploader.upload(fileStr,{folder: id}, async(err, result)=>{
            if(err) throw err;
            res.json({public_id: result.public_id, url: result.secure_url})
        })
    }
    catch(err){
        return res.status(500).json({msg: err.message})
    }
})

//delete image
router.post('/destroy',auth, authAdmin, (req, res) =>{
try{

    const {public_id} = req.body;
    if(!public_id) return res.status(400).json({msg: "No file to destroy!"})

    cloudinary.v2.uploader.destroy(public_id, async(err, result)=>{
        if(err) throw err;
        res.json({msg: "Deleted successfully!"})
    })

}catch(err){
    return res.status(500).json({msg: err.message})
}
})

router.get('/images/:id', async (req,res)=>{
    try {
        var id = req.params.id
        const resources = await cloudinary.v2.search
            .expression(`folder:${id}`)
            .sort_by('public_id', 'desc')
            .max_results(8)
            .execute() .then(result => {
                const publicIds = result.resources.map((file)=> file.public_id)        
                res.json(publicIds)
            })
        
        
    } catch (err) {
        res.status(500).json({msg: err})
    }
})

module.exports = router