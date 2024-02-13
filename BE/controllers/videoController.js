const courseModel = require("../models/courseModel");
const VideoModel = require("../models/CourseVideoModal");
const errorHandler = require("../utils/errorHandler");
const getDataUri = require("../utils/dataUri");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your API Key and Secret



  exports.CreateVideo = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    const file = req.file; 
    const { title, description } = req.body;
//  if(!file || !title  || description ){ 
//     return next(new errorHandler("Please fill all the required fields", 500));
//  }
 
   let name = file.originalname;

   const fileUri = getDataUri(file);
   const fileType = file.mimetype.split("/")[1];
   
   const myCloud = await cloudinary.uploader.upload(fileUri.content, {
       resource_type: fileType === "video" ? "video" : "raw",
   });
   
   
   
   const createdDocument = await VideoModel.create({
    videoLink: myCloud.secure_url,
    title: name,
    description: 'Video description', 
});

    const update = await courseModel.findByIdAndUpdate(courseId, {
        $push: { videos: createdDocument },
        });

    res.status(201).send({
      success: true,
      update,
      msg: "videos created successfully",
      
    });
});





exports.GetCourseVideos = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId).populate('videos');

    if (!course) {
        return res.status(404).json({
            success: false,
            msg: 'Course not found',
        });
    }

    // Extract videos from the course
    const videos = course.videos;

    res.status(200).json({
        success: true,
        videos,
    });
});



exports.UpdateVideo = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    const file = req.file;
    const { title, description } = req.body;

    try {
        // Check if the course exists
        const existingCourse = await courseModel.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                msg: 'Course not found',
            });
        }

        // Check if the video already exists for the course
        const existingVideo = await VideoModel.findOne({ title, courseId });
        
        // If the video already exists, update it
        if (existingVideo) {
            const fileUri = getDataUri(file);
            const fileType = file.mimetype.split('/')[1];
            const myCloud = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: fileType === 'video' ? 'video' : 'raw',
            });

            existingVideo.videoLink = myCloud.secure_url;
            existingVideo.title = title || existingVideo.title;
            existingVideo.description = description || existingVideo.description;
            await existingVideo.save();

            res.status(200).json({
                success: true,
                msg: 'Video updated successfully',
                updatedVideo: existingVideo,
            });
        } else {
            // If the video does not exist, create a new one
            const fileUri = getDataUri(file);
            const fileType = file.mimetype.split('/')[1];
            const myCloud = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: fileType === 'video' ? 'video' : 'raw',
            });

            const createdDocument = await VideoModel.create({
                videoLink: myCloud.secure_url,
                title: title || file.originalname,
                description: description || 'Video description',
                courseId,
            });

            // Update the course with the new video
            await courseModel.findByIdAndUpdate(
                courseId,
                { $push: { videos: createdDocument._id } },
                { new: true, useFindAndModify: false }
            );

            res.status(201).json({
                success: true,
                msg: 'Video created successfully',
                createdVideo: createdDocument,
            });
        }
    } catch (error) {
        console.error('Error in creating or updating video:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error',
        });
    }
});
