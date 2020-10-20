const router = require('express').Router();
const Log = require("../models/Log")
const jwt_decode = require("jwt-decode")

router.post('/find', (req,res)=>{
    const { user_id } = req.body
    const userInfo = jwt_decode(user_id)
    Log.find({ user_id: userInfo._id}, (err, doc)=>{
        if (err) {
            res.json({error: "Something went wrong with fetching entries"})
            console.log(err.stack)
        } else {
            res.send(doc)
        }
    })
})

router.post('/', async (req,res)=> {
    const request = {...req.body, user_id: jwt_decode(req.body.user_id)}
    try {
        const logEntry = new Log(request)
        const savedLog = await logEntry.save();
        res.json(savedLog)
    } catch (err) {
        res.json({error: "Failed to add entry"})
    }
})

router.delete('/', async (req, res) => {
    const { id } = req.body
    try {
        const result = await Log.deleteOne({ _id: id })
        res.json({ deletedCount: result.deletedCount })
    } catch (err) {
        res.json({ error: "Failed to delete log"})
    }
   
})

module.exports = router