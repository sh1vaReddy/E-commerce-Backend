const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetpassword,
  updatepassword,
  updateprofie,
  getAlluser,
  getsingleuser,
  deleteprofie,
  updateuserole,
} = require("../controllers/usercontroller");
const { getuserdetails } = require("../controllers/usercontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/logout").get(logout);
router.route("/register").post(registerUser);
router.route("/Login").post(login);
router.route("/forgetpassword").post(forgotPassword);
router.route("/password/reset/:token").put(resetpassword);
router.route("/me").get(isAuthenticatedUser, getuserdetails);
router.route("/password/update").put(isAuthenticatedUser, updatepassword);
router.route("/me/update").put(isAuthenticatedUser, updateprofie);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAlluser);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getsingleuser)
  .put(isAuthenticatedUser, authorizeRoles("admin"),updateuserole)
  .delete(isAuthenticatedUser, authorizeRoles("admin", deleteprofie));

module.exports = router;
