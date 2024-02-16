const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage }).fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    ]);

module.exports = upload;
