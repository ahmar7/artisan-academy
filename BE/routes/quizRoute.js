let express = require("express");
const {
    CreateQuiz,
    getQuizzesByCourseId,
    updateQuizInCourse,DeleteQuiz
} = require("../controllers/quizController");


let router = express.Router();

router.route("/quiz/:id").post(CreateQuiz);
router.route("/quiz/:id").get(getQuizzesByCourseId);
router.route("/course/:courseId/quiz/:quizId").patch(updateQuizInCourse);
router.route("/course/:courseId/quiz/:quizId").delete(DeleteQuiz);
// router.route("/video/:id").get(GetVideobyId);

// router.route("/course/:id").delete(DeleteCourse);

module.exports = router;
