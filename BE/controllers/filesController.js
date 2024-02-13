const errorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary").v2;
const FilesModel = require("../models/filesModel"); // Update the path accordingly

exports.uploadFiles = catchAsyncErrors(async (req, res, next) => {
  const files = req.files;
  console.log("req.files: ", files);

  // Map each file to create a new document for each
  const uploadPromises = files.map(async (file) => {
    let name = file.originalname;

    const fileUri = getDataUri(file);
    const fileType = file.mimetype.split("/")[1];

    const myCloud = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: fileType === "image" ? "image" : "raw", 
    });

    const newDocument = await FilesModel.create({
      type: file.mimetype,
      name: name,
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
      size: file.size,
    });

    return newDocument;
  });

  const createdDocuments = await Promise.all(uploadPromises);

  res.status(201).send({
    success: true,
    msg: "Uploaded successfully",
    createdDocuments,
  });
});

exports.getAllData = catchAsyncErrors(async (req, res, next) => {
  const allFiles = await FilesModel.find();

  // A simple function, follow function path to read description

  res.status(200).send({
    success: true,
    msg: "Data fetched",
    allFiles,
  });
});
exports.deleteSingleFile = catchAsyncErrors(async (req, res, next) => {
  const fileIdToDelete = req.params._id;
  console.log("fileIdToDelete: ", fileIdToDelete);

  // Delete the document based on the inner array's ID
  const result = await FilesModel.findByIdAndDelete({
    _id: fileIdToDelete,
  });

  if (!result) {
    return next(
      new errorHandler("File not found or already has been deleted", 400)
    );
  }

  res.status(200).send({
    success: true,
    msg: "File deleted successfully",
  });
});

// Logout User
