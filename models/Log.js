const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    image: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    visited_at: {
        type: Date,
        required: true
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180, 
    }
}, {timestamps: true});

module.exports = mongoose.model("Log", logSchema)