const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,  // Set default value for clicks to 0
  },
}, { timestamps: true });

// Create the model
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
