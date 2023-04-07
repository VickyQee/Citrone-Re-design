const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true
  }
}, { timestamps: true, expires: new Date(Date.now() + (1000 * 3 * 60)) })

module.exports = mongoose.model('token', tokenSchema)