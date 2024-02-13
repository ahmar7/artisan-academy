const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: Number,
  image: String,
  title: String,
  description: String,
  category: String,
  level: String,
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

const courseModel = mongoose.model('Item', courseSchema);

module.exports = courseModel;