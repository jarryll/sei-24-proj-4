const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // Check if email already exists
    const emailExists = await User.findOne({email})
    // If it doesn't, proceed to add to Collection
    if (!emailExists) {
        // Hash the password
        const salt = await bcrypt.genSalt (10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // Create new user object
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });
        try {
            const savedUser = await user.save();
            res.send({user: user_id});
        } catch (err) {
            res.status(400).send(err);
        }
    // Or else, tell front end that the email already exists
    } else {
        res.status(400).json({error: "Email already exists"})
    }  
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = User.findOne({email}, async (err, user) => {
        if (user === null) {
            res.status(400).json({error: "User does not exist"})
        } else {
            const validPass = await bcrypt.compare(password, user.password)
            if (validPass) {
                const token = jwt.sign( {_id: user._id}, process.env.TOKEN_SECRET)
                res.json({token})
                // res.json({success: "Authenticated"})
            } else {
                res.sendStatus(401)
            }
        }
    })
})

module.exports = router;
