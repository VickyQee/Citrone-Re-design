const { sign, verify } = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config()

const generateAuthToken = (data, expiresIn = "7d") => {
  if(typeof data === "object") {
    return sign({ ...data }, process.env.APP_SECRET, { expiresIn })
  }
  return sign({ data }, process.env.APP_SECRET, { expiresIn })
}

const verifyToken = (token) => verify(token, process.env.APP_SECRET)

module.exports = {
  verifyToken,
  generateAuthToken
}