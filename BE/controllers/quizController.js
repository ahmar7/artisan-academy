
const courseModel = require("../models/courseModel");
 const QuizModel = require("../models/quizModel");
const errorHandler = require("../utils/errorHandler");
const getDataUri = require("../utils/dataUri");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');




exports.CreateQuiz = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    const { question, options, isCorrect } = req.body;
  
    try {
      const createdDocument = await QuizModel.create({
        question: question,
        options: options,
        isCorrect: isCorrect,
      });
  
      const updatedCourse = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $push: { quizzes: createdDocument._id },
        },
        { new: true }
      );
  
      res.status(201).send({
        success: true,
        update: updatedCourse,
        msg: "Quiz created successfully",
      });
    } catch (error) {
      // Handle errors and pass them to the error handling middleware (catchAsyncErrors)
      next(error);
    }
  });






exports.getQuizzesByCourseId = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.search || '';

    const course = await courseModel.findById(courseId).populate({
        path: 'quizzes',
        match: {
            $or: [
                { question: { $regex: searchQuery, $options: 'i' } },
                { options: { $regex: searchQuery, $options: 'i' } },
                { isCorrect: { $regex: searchQuery, $options: 'i' } },
               
            ],
        },
    });

    if (!course) {
        return res.status(404).json({
            success: false,
            msg: 'Course not found',
        });
    }

    const videos = course.quizzes;

    // Apply search query on videos
    const filteredVideos = videos.filter(video =>
        (video.question && video.question.match(new RegExp(searchQuery, 'i')))
    
    );

    const totalItems = filteredVideos.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page > totalPages ? totalPages : page;

    const paginatedVideos = filteredVideos.slice((currentPage - 1) * limit, currentPage * limit);

    res.status(200).json({
        success: true,
        quizes: paginatedVideos,
        currentPage,
        totalPages,
        totalItems,
    });
});


// Update a quiz in a course
exports.updateQuizInCourse = catchAsyncErrors(async (req, res, next) => {
    const { courseId, quizId } = req.params;
    const { question, options, isCorrect } = req.body;
  
    try {
      // Update the quiz
      const updatedQuiz = await QuizModel.findByIdAndUpdate(
        quizId,
        {
          question: question,
          options: options,
          isCorrect: isCorrect,
        },
        { new: true }
      );
  
      if (!updatedQuiz) {
        return res.status(404).json({
          success: false,
          msg: 'Quiz not found',
        });
      }
  
      // Update the course with the modified quiz using the positional operator $
      const updatedCourse = await courseModel.findOneAndUpdate(
        { _id: courseId, quizzes: quizId },
        { $set: { 'quizzes.$': updatedQuiz._id } },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({
          success: false,
          msg: 'Course not found or quiz not associated with the course',
        });
      }
  
      res.status(200).json({
        success: true,
        updatedQuiz,
        updatedCourse,
        msg: 'Quiz updated successfully in the course',
      });
    } catch (error) {
      next(error);
    }
  });
  


  exports.DeleteQuiz = catchAsyncErrors(async (req, res, next) => {
    const { courseId, quizId } = req.params;
  
    try {
        let deletedCourse = await QuizModel.findByIdAndDelete
        ({ _id: quizId });
    
  if(!deletedCourse)
  {
    return res.status(404).json({
      success: false,
      msg: 'quiz not found',
    });
  }
 
      const update = await courseModel.findByIdAndUpdate(courseId, {
        $pull: { quizzes: { _id: quizId } },
      });
  
      res.status(200).json({
        success: true,
        update,
        msg: 'quiz deleted successfully',
      });
    } catch (error) {
      next(new errorHandler(error, 500));
    }
  });
