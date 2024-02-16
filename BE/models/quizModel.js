const mongoose = require('mongoose');

const courseQuizSchema = new mongoose.Schema({
  id: Number,
  question: String,
  options: [String], 
  isCorrect: String,
});

const QuizModel = mongoose.model('Quiz', courseQuizSchema);

module.exports = QuizModel;
