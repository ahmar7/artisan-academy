let express = require("express");
const {
    CreateEnroll,
    GetUserData,GetEnrollCourse,EnrollVideo,QuizResult
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middlewares/authMiddleware");
let router = express.Router();

router.route("/enroll/:courseId").post(authMiddleware,CreateEnroll,);
router.route("/enroll/:courseId/video/:videoId").post(authMiddleware,EnrollVideo,);
router.route("/profile").get(authMiddleware,GetUserData);
router.route("/enroll/course/:courseId").get(authMiddleware,GetEnrollCourse);
router.route("/enroll/quiz/:courseId").post(authMiddleware,QuizResult);
// router.route("/course/:courseId/videos/:videoId").patch(singleUpload,UpdateVideo);
// router.route("/course/:courseId/videos/:videoId").delete(DeleteVideo);
// router.route("/video/:id").get(GetVideobyId);

// router.route("/course/:id").delete(DeleteCourse);

module.exports = router;
