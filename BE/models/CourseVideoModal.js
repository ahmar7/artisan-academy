const mongoose = require('mongoose');

const courseVideoSchema = new mongoose.Schema({
  id: Number,
  videoLink: String,
  title: String,
  description: String,
 
});

const courseVideoModel = mongoose.model('Video', courseVideoSchema);

module.exports = courseVideoModel;