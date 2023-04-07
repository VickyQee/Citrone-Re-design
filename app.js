const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { response } = require('./src/utils');


const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))



// MAIN ROUTE
app.get("/", (req, res) => {
  // 200 -> OK
  res.status(200).send(response("Hello from CITRONE API", null))
})

// API ROUTES
const routes = require("./src/routes")
app.use("/api", routes)

// ERROR ROUTES -> INCASE THE USER ENTERS AN INVALID ROUTE
app.use("*", (req, res) => {
  // 404 -> NOT FOUND
  res.status(404).send(response("Invalid Route!", null, false))
})


// MONGODB CONNECTION HERE
const database = require("./src/database");

app.listen(PORT, async () => {
  await database()
  console.log(`server running on port http://localhost:${PORT}`)
})


