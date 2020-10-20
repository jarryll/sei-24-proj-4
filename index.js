const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// App Middleware
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json({limit: "50mb"}));
app.use(
    express.urlencoded({
        extended: true,
    })
);

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_CONNECT, () =>
    console.log("Connected to MongoDB!")
);

// Routes middleware


const authRoute = require("./routes/auth");
app.use("/api/user", authRoute);

const amadeusRoute = require('./routes/amadeus');
app.use("/info", amadeusRoute);

const logRoute = require("./routes/log");
app.use("/api/log", logRoute)

const uploadImgRoute = require("./routes/uploadImg");
app.use("/api/upload", uploadImgRoute)

if (process.env.NODE_ENV === "production") {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "client/build/index.html"))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));

