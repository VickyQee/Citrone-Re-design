const routers = require("express").Router()

// GET ALL ROUTES
const authRoutes = require("./auth.routes")
const userRoutes = require("./user.routes")


// FOR AUTH ROUTES
routers.use("/auth", authRoutes)

// FOR USERS ROUTES
routers.use("/user", userRoutes)

module.exports = routers