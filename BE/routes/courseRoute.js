let express = require("express");
const {
    CreateCourse,
    GetCourse,
    GetCoursebyId,
    UpdateCourse,
    DeleteCourse,
} = require("../controllers/courseController");

const singleUpload = require("../middlewares/multer");
let router = express.Router();

router.route("/course").post(singleUpload,CreateCourse);
router.route("/course").get(GetCourse);
router.route("/course/:id").get(GetCoursebyId);
router.route("/course/:id").patch(singleUpload,UpdateCourse);
router.route("/course/:id").delete(DeleteCourse);

module.exports = router;
