let express = require("express");
const {
    CreateProfile,GetProfile,updatetProfile,dashboard
} = require("../controllers/profileController");

const singleUpload = require("../middlewares/multer");
const upload = require("../middlewares/MultiFiltes");
let router = express.Router();

router.route("/profile").post(singleUpload,CreateProfile);
router.route("/allprofile").get(GetProfile);
router.route("/profile/:id").put(singleUpload,updatetProfile);

router.route("/dashboard").get(dashboard);

module.exports = router;