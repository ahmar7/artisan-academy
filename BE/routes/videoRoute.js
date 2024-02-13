let express = require("express");
const {
    CreateVideo,
    GetCourseVideos,
    UpdateVideo,
} = require("../controllers/videoController");

const singleUpload = require("../middlewares/multer");
let router = express.Router();

router.route("/video/:id").post(singleUpload,CreateVideo);
router.route("/course/:id/videos").get(GetCourseVideos);
router.route("/video/:id").patch(singleUpload,UpdateVideo);
// router.route("/course/:id").get(GetCoursebyId);

// router.route("/course/:id").delete(DeleteCourse);

module.exports = router;
