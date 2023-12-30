const express = require("express");
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");
const {
  newOrder,
  getSingleorder,
  MyOrders,
  getAllorder,
  deleteorder,
  updatestatusorder,
} = require("../controllers/ordercontroller");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/me").get(isAuthenticatedUser, MyOrders);

router.route("/order/:id").get(isAuthenticatedUser, getSingleorder);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllorder);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updatestatusorder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteorder);

module.exports = router;
