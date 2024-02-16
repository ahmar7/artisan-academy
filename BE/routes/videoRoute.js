let express = require("express");
const {
    CreateVideo,
    GetCourseVideos,
    UpdateVideo,
    DeleteVideo,
    GetVideobyId
} = require("../controllers/videoController");

const singleUpload = require("../middlewares/multer");
let router = express.Router();

router.route("/video/:id").post(singleUpload,CreateVideo);
router.route("/course/:id/videos").get(GetCourseVideos);
router.route("/course/:courseId/videos/:videoId").patch(singleUpload,UpdateVideo);
router.route("/course/:courseId/videos/:videoId").delete(DeleteVideo);
router.route("/video/:id").get(GetVideobyId);

// router.route("/course/:id").delete(DeleteCourse);

module.exports = router;
