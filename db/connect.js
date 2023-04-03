const mongoose = require("mongoose")

// connection to database 
const connectDB = async (url) => {
    await mongoose.set("strictQuery", true)
    await mongoose.connect(url, {
        useNewUrlParser : true
    })
}

module.exports = connectDB 