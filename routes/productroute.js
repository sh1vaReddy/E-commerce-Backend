const express = require("express");
const {
  getallproduct,
  centreproduct,
  updateproduct,
  getproductdetails,
  productreview,
  getAdminproducts,
  deleteProduct,
} = require("../controllers/productcontroller");
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/product").get(getallproduct);

router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminproducts)
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), centreproduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateproduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct)
  .get(getproductdetails);

router.route("/product/:id").get(getproductdetails);

router.route("/review").put(isAuthenticatedUser, productreview);

router
  .route("/reviews")
  .get(getallproduct)
  .delete(isAuthenticatedUser,deleteProduct);

module.exports = router;
