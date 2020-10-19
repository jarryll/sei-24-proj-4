const router = require("express").Router();
const Amadeus = require("amadeus");
const dotenv = require("dotenv");

dotenv.config()

const amadeus = new Amadeus ({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})


router.post('/placesOfInterest', async (req, res)=> {
    const {latitude, longitude} = req.body
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${latitude}&longitude=${longitude}&radius=2`

    try {
        const response = await amadeus.client.get(url)
        res.send(response)
    } catch (err) {
        console.log(err)
    }
   
})

module.exports = router