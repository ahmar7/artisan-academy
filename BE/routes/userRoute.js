let express = require("express");
const {
  RegisterUser,
  loginUser,
  logoutUser,
  resetPassword,
  allUser,
  singleUser,
  updateSingleUser,
  verifySingleUser,
  getsignUser,
  verifyToken,
  LoginWithGoogle,
  updateKyc,
  sendTicket,
  getHtmlData,
  setHtmlData,
  adminResetPassword,
  bypassSingleUser,
  adminProfileUpdate,
  adminResetNewPassword,
  sendEmailCode,
  AdminChangePassowrd
} = require("../controllers/userController");
const { isAuthorizedUser, authorizedRoles } = require("../middlewares/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/loginWithGoogle").post(LoginWithGoogle);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
//admin forget password
router.route("/admin/forgot-password").post(adminResetPassword);
router.route("/admin/reset-password/:resetToken").post(adminResetNewPassword);
router.route("/admin/profileUpdate").put(authMiddleware,adminProfileUpdate);
router.route("/admin/changePassword").post(authMiddleware,AdminChangePassowrd);

router
  .route("/allUser")
  .get(allUser);
router
  .route("/singleUser/:id")
  .get(isAuthorizedUser, authorizedRoles("admin"), singleUser);
router
  .route("/updateSingleUser/:id")
  .post(isAuthorizedUser, authorizedRoles("admin"), updateSingleUser);
router
  .route("/bypassSingleUser/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), bypassSingleUser);
router
  .route("/verifySingleUser")
  .patch(isAuthorizedUser, singleUpload, verifySingleUser);
router.route("/password/reset").post(resetPassword);
router.route("/getsignUser").patch(isAuthorizedUser, singleUpload, getsignUser);
router.route("/:id/verify/:token").get(verifyToken);
router
  .route("/updateKyc/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), updateKyc);

router.route("/sendTicket").post(isAuthorizedUser, sendTicket);
router.route("/sendEmail").post(isAuthorizedUser, sendEmailCode);

module.exports = router;
