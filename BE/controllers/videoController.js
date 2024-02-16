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
         format: 'mp4',
   });
   
   
   
   const createdDocument = await VideoModel.create({
    videoLink: myCloud.secure_url,
    title: title,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.search || '';

    const course = await courseModel.findById(courseId).populate({
        path: 'videos',
        match: {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ],
        },
    });

    if (!course) {
        return res.status(404).json({
            success: false,
            msg: 'Course not found',
        });
    }

    const videos = course.videos;

    // Apply search query on videos
    const filteredVideos = videos.filter(video =>
        (video.title && video.title.match(new RegExp(searchQuery, 'i'))) ||
        (video.description && video.description.match(new RegExp(searchQuery, 'i')))
    );

    const totalItems = filteredVideos.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page > totalPages ? totalPages : page;

    const paginatedVideos = filteredVideos.slice((currentPage - 1) * limit, currentPage * limit);

    res.status(200).json({
        success: true,
        videos: paginatedVideos,
        currentPage,
        totalPages,
        totalItems,
    });
});




exports.UpdateVideo = catchAsyncErrors(async (req, res, next) => {
    const { courseId, videoId } = req.params;
    const { title, description } = req.body;
    const file = req.file;
  
    try {
      // Check if the video exists
      const existingVideo = await VideoModel.findById(videoId);
  
      if (!existingVideo) {
        return res.status(404).json({
          success: false,
          msg: 'Video not found',
        });
      }
  
      // Update video information
      if (title) existingVideo.title = title;
      if (description) existingVideo.description = description;
  
      // Upload new file to Cloudinary if provided
      if (file) {
        const fileUri = getDataUri(file);
        const fileType = file.mimetype.split('/')[1];
  
        const myCloud = await cloudinary.uploader.upload(fileUri.content, {
          resource_type: fileType === 'video' ? 'video' : 'raw',
          format: 'mp4',
        });
  
        existingVideo.videoLink = myCloud.secure_url;
      }
  
      // Save the updated video document
      const updatedVideo = await existingVideo.save();
  
      // Update the course with the modified video
      const update = await courseModel.findByIdAndUpdate(courseId, {
        $set: { 'videos.$[elem]': updatedVideo },
      }, { arrayFilters: [{ 'elem._id': videoId }] });
  
      res.status(200).json({
        success: true,
        update,
        msg: 'Video updated successfully',
      });
    } catch (error) {
      next(new errorHandler(error, 500));
    }
  });




  exports.DeleteVideo = catchAsyncErrors(async (req, res, next) => {
    const { courseId, videoId } = req.params;
  
    try {
        let deletedCourse = await VideoModel.findByIdAndDelete
        ({ _id: videoId });
    
  if(!deletedCourse)
  {
    return res.status(404).json({
      success: false,
      msg: 'Video not found',
    });
  }
 
      const update = await courseModel.findByIdAndUpdate(courseId, {
        $pull: { videos: { _id: videoId } },
      });
  
      res.status(200).json({
        success: true,
        update,
        msg: 'Video deleted successfully',
      });
    } catch (error) {
      next(new errorHandler(error, 500));
    }
  });


  exports.GetVideobyId = catchAsyncErrors(async (req, res, next) => {
    const videoId = req.params.id;
    let singlevideo = await VideoModel.findById({ _id: videoId });
   
  res.status(200).send({
    success: true,
    msg: "All Courses fetched successfully",
    singlevideo
  });
});
