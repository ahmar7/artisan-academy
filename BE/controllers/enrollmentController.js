
const courseModel = require("../models/courseModel");
 const QuizModel = require("../models/quizModel");
 const VideoModel = require("../models/CourseVideoModal");
 const userModel = require("../models/userModel");

const errorHandler = require("../utils/errorHandler");
const getDataUri = require("../utils/dataUri");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const mongoose = require('mongoose');
const ProfileModel = require("../models/profileImageModel");
const { ObjectId } = mongoose.Types;



exports.CreateEnroll = catchAsyncErrors(async (req, res, next) => {  
    try {
        const { courseId } = req.params;
        
        // Check if the course exists (You might need to replace 'Course' with your actual model name)
        const course = await courseModel.findById(courseId);
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }
    
        // Check if the user is already enrolled in the course
        const isEnrolled = req.user.Enrolment.some(enrollment => enrollment.courseId.equals(courseId));
        if (isEnrolled) {
          return res.status(400).json({ error: 'User is already enrolled in the course' });
        }
    
        // Add enrollment to the user
        req.user.Enrolment.push({ courseId });
    
        // Save the user with the new enrollment
        await req.user.save();
    
        res.status(201).json({ message: 'Enrollment successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });



  exports.GetUserData = catchAsyncErrors(async (req, res, next) => {
    try {
      const userData = req.user;
  
      // Check if userData exists and has the enrollment field
      if (!userData || !userData.Enrolment) {
        return res.status(200).json({
          message: 'User has no enrollment data',
        });
      }
  
      const enrollmentData = userData.Enrolment;
  
      // Check if enrollmentData is an array
      if (!Array.isArray(enrollmentData)) {
        return res.status(200).json({
          message: 'Enrollment data is not an array',
      
        });
      }
  


      
      // Array to store enriched course data
      const enrichedCourses = [];
  
      // Loop through each enrollment and fetch course details
      for (const enrollment of enrollmentData) {
        const courseId = enrollment.courseId;
  
        // Fetch course details and videos using the courseId
        const course = await courseModel.findById(courseId);
        if (!course) {
          console.log(`Course with ID ${courseId} not found.`);
          continue; // Skip to the next iteration if course not found
        }
  
        // Assuming the Video model has a reference to the Course model
        const videos = await VideoModel.find({ courseId: courseId });
  
        // Enrich the course data with videos and other details
        const enrichedCourse = {
          courseId: course._id,
          courseTitle: course.title,
          quizTaken: enrollment.quizTaken,
          cpdpoint:enrollment.quizPoints,
          courseImage: course.image,
          courseCategory: course.category,
          enrolledAt: enrollment.enrolledAt,
          totalVideos: videos,
          videosCompleted: enrollment.videosCompleted,
          // Add other properties as needed
        };
  
        enrichedCourses.push(enrichedCourse);
      }

      const allprofile=await ProfileModel.find();
  
      res.status(200).json({
        message: 'User data retrieved successfully',
        data: enrichedCourses,
        userData,
        allprofile
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  exports.GetEnrollCourse = catchAsyncErrors(async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const userData = req.user;
  
      // Check if userData exists and has the enrollment field
      if (!userData || !userData.Enrolment) {
        return res.status(200).json({
          message: 'User has no enrollment data',
        });
      }
  
      const enrollmentData = userData.Enrolment;
  
      // Validate if the courseId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: 'Invalid courseId format' });
      }
  
      // Check if the course exists
      const course = await courseModel
        .findById(courseId)
        .populate('videos')  // Populate the 'videos' field with actual video documents
        .populate('quizzes'); // Populate the 'quizzes' field with actual quiz documents
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const enroldata = enrollmentData.find((v) => v.courseId == courseId);
  
      if (!enroldata) {
        return res.status(200).json({
          message: 'User is not enrolled in this course',
        });
      }
  
      const completedVideos = enroldata.videosCompleted || [];
      const videos = course.videos || [];
  
      const videosWithCompletionStatus = videos.map((v, index) => {
        const isCompleted = index === 0 ? true:completedVideos.some((b) => b.videoId.toString().toLowerCase() === v._id.toString().toLowerCase());
        const isNextUnlocked = index===0?true: completedVideos.some((b) => b.videoId.toString().toLowerCase() === videos[index - 1]._id.toString().toLowerCase())
         
        return {
            _id: v._id,
            title: v.title,
            videoLink: v.videoLink,
            description: v.description,
            completed:isCompleted ,
            isNextUnlocked: isNextUnlocked,
        };
    });
    if(completedVideos.length === videos.length){
        enroldata.quizTaken = true;
        await userData.save();
    }

      console.log('videosWithCompletionStatus:', videosWithCompletionStatus);
  
      // Include other information or transformations as needed
      res.status(200).json({ videosWithCompletionStatus, course,enroldata });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  exports.EnrollVideo = catchAsyncErrors(async (req, res, next) => {
    try {
      const { courseId, videoId } = req.params;
  
      // Check if the video is already marked as completed for the user and course
      const user = await userModel.findOne({
        _id: req.user._id,
        'Enrolment.courseId': courseId,
        'Enrolment.videosCompleted.videoId': videoId,
      });
  
      if (user) {
        // Video is already marked as completed, do not add it again
        return res.status(200).json({ error: 'Video is already marked as completed for this user and course' });
      }
  
      const updatedUser = await userModel.findOneAndUpdate(
        {
          _id: req.user._id,
          'Enrolment.courseId': courseId,
        },
        {
          $addToSet: {
            'Enrolment.$.videosCompleted': {
              videoId: videoId,
              completedAt: Date.now(),
            },
          },
        },
        { new: true }
      );
  
      res.status(200).json({ message: 'User enrolled in the course and video marked as completed', updatedUser });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


    
  exports.QuizResult = catchAsyncErrors(async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const userData = req.user;
      const { ans } = req.body;
  
      // Check if userData exists and has the enrollment field
      if (!userData || !userData.Enrolment) {
        return res.status(200).json({
          message: 'User has no enrollment data',
        });
      }
  
      const enrollmentData = userData.Enrolment;
  
      // Validate if the courseId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: 'Invalid courseId format' });
      }
  
      // Check if the course exists
      const course = await courseModel
        .findById(courseId)
        .populate('videos')
        .populate('quizzes');
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const enroldata = enrollmentData.find((v) => v.courseId == courseId);
  
      if (!enroldata) {
        return res.status(200).json({
          message: 'User is not enrolled in this course',
        });
      }
  
      const courseQuiz = course.quizzes || [];
  
      // Calculate cpdpoint
      const cpdpoint = courseQuiz.reduce((totalPoints, quiz, index) => {
        const isCorrect = quiz.isCorrect === ans[index];
        return totalPoints + (isCorrect ? 10 : 0);
      }, 0);
  
      // Update the user's enrollment data with quiz points
      const updatedUser = await userModel.findOneAndUpdate(
        {
          _id: req.user._id,
          'Enrolment.courseId': courseId,
        },
        {
          $set: {
            'Enrolment.$.quizPoints': cpdpoint,
          },
        },
        { new: true }
      );
  
      // Add the courseId to completeCourses array
      await userModel.findOneAndUpdate(
        { _id: userData._id },
        { $addToSet: { completeCourses: courseId } },
        { new: true }
      );
  
      res.status(200).json({ userData: updatedUser, quizPoints: cpdpoint });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  