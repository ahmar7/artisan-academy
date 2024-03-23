const courseModel = require("../models/courseModel");
let UserModel = require("../models/userModel");
const ProfileModel = require("../models/profileImageModel");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const userModel = require("../models/userModel");
const moment = require("moment");
// Configure Cloudinary with your API Key and Secret

exports.CreateProfile = catchAsyncErrors(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  let name = file.originalname;

  const fileUri = getDataUri(file);
  const fileType = file.mimetype.split("/")[1];

  const myCloud = await cloudinary.uploader.upload(fileUri.content, {
    resource_type: fileType === "image" ? "image" : "raw",
    format: "png",
  });

  const createdDocument = myCloud.secure_url;
  const newCourse = await ProfileModel.create({
    profile: createdDocument,
  });
  res.status(201).send({
    success: true,
    msg: "successfully created profile image",
    newCourse,
  });
});

exports.GetProfile = catchAsyncErrors(async (req, res, next) => {
  const allProfile = await ProfileModel.find();
  res.status(200).json({
    success: true,
    allProfile,
  });
});

exports.updatetProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.file;
    const { id } = req.params;

    const { profile } = req.body;
    if (file) {
      const name = file.originalname;
      const fileUri = getDataUri(file);
      const fileType = file.mimetype.split("/")[0]; // Use [0] instead of [1] to get the file type

      const myCloud = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: fileType === "image" ? "image" : "raw",
        format: "png",
      });

      const updatedDocument = await userModel.findByIdAndUpdate(
        id,
        { profile: myCloud.secure_url },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedDocument });
    } else {
      const updatedDocument = await userModel.findByIdAndUpdate(
        id,
        { profile: profile },
        { new: true }
      );
      res
        .status(200)
        .json({
          message: "Profile updated successfully",
          updatedDocument,
          success: true,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.dashboard = catchAsyncErrors(async (req, res, next) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year parameter is required" });
    }

    const userCounts = await userModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          "_id.year": parseInt(year, 10),
        },
      },
    ]);

    const userCounters = userCounts.map((v) => {
      return {
        month: v._id.month,
        count: v.count,
      };
    });

    const topEnrollmentCourses = await userModel.aggregate([
      {
        $unwind: "$Enrolment",
      },
      {
        $group: {
          _id: "$Enrolment.courseId",
          enrollments: { $sum: 1 },
        },
      },
      {
        $sort: {
          enrollments: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);

    const topCoursesDetails = await courseModel.find({
      _id: { $in: topEnrollmentCourses.map((item) => item._id) },
    });

    const result = topCoursesDetails.map((course) => ({
      courseId: course._id,
      courseName: course.title,
      courseImage: course.image, // Replace with the actual property name
      enrollments: topEnrollmentCourses.find((item) =>
        item._id.equals(course._id)
      ).enrollments,
    }));
    const totalUser = await userModel.countDocuments();
    const totalCourse = await courseModel.countDocuments();
    res.status(200).json({
      success: true,
      result,
      totalUser,
      totalCourse,
      userCounters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
