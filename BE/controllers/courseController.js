
const courseModel = require("../models/courseModel");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const getDataUri = require("../utils/dataUri");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your API Key and Secret



  exports.CreateCourse = catchAsyncErrors(async (req, res, next) => {
    const file = req.file; 
   const {
     title,
     description,
     category,
     level,
  
   } = req.body;
if (
     !title ||
     !description ||
     !category ||
     !level||
     !file
   ) {
     return next(new errorHandler("Please fill all the required fields", 500));
   }
   let name = file.originalname;

   const fileUri = getDataUri(file);
   const fileType = file.mimetype.split("/")[1];
   
   const myCloud = await cloudinary.uploader.upload(fileUri.content, {
       resource_type: fileType === "image" ? "image" : "raw",
   });
   
   const createdDocument = myCloud.secure_url;
    const newCourse = await courseModel.create({
      title,
      description,
      category,
      level,
      image: createdDocument,
    });
    res.status(201).send({
      success: true,
      msg: "Course created successfully",
      newCourse,
    });
});



exports.GetCourse = catchAsyncErrors(async (req, res, next) => {
    let allCourse = await courseModel.find();
  res.status(200).send({
    success: true,
    msg: "All Courses fetched successfully",
    allCourse,
  });
});


exports.GetCoursebyId = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    let singleCourse = await courseModel.findById({ _id: courseId });
   
  res.status(200).send({
    success: true,
    msg: "All Courses fetched successfully",
    singleCourse,
  });
});


exports.UpdateCourse = catchAsyncErrors(async (req, res, next) => {
    const file = req.file;
    const courseId = req.params.id;
    const {
        title,
        description,
        category,
        level,
    } = req.body;

    try {
        if (!title || !description || !category || !level) {
            return next(new errorHandler("Please fill all the required fields", 500));
        }

        let updatedCourse;

        if (file) {
            let name = file.originalname;
            const fileUri = getDataUri(file);
            const fileType = file.mimetype.split("/")[1];

            const myCloud = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: fileType === "image" ? "image" : "raw",
            });

            updatedCourse = await courseModel.findByIdAndUpdate(
                { _id: courseId },
                {
                    title,
                    description,
                    category,
                    level,
                    image: myCloud.secure_url,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );
        } else {
            // If no file is provided, update the course without modifying the image
            updatedCourse = await courseModel.findByIdAndUpdate(
                { _id: courseId },
                {
                    title,
                    description,
                    category,
                    level,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );
        }

        res.status(200).send({
            success: true,
            msg: "Course updated successfully",
            updatedCourse,
        });
    } catch (error) {
        console.error('Error in UpdateCourse:', error);
        res.status(500).send({
            success: false,
            msg: 'Internal Server Error',
        });
    }
});


exports.DeleteCourse = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;
    let deletedCourse = await courseModel.findByIdAndDelete
    ({ _id: courseId });
    res.status(200).send({
        success: true,
        msg: "Course deleted successfully",
        deletedCourse,
        });
});
