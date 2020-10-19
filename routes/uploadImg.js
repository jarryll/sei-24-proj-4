const router = require('express').Router();
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv')

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

router.post('/', async (req, res) => {
    const {image} = req.body
    try {
        const response = await cloudinary.uploader.upload(image)
        res.json({image_url:response.url})
    } catch (err) {
        res.json({error:"Failed to upload image"})
    }
})


module.exports = router