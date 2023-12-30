 const express=require("express");
 const router=express.Router();
 const{isAuthenticatedUser} =require("../middleware/auth");
const {processPayment,sendStripeApiKey}  = require("../controllers/paymentcontroller");


router.route("/payment/process").post(isAuthenticatedUser,processPayment)
router.route("/stripekey").get(isAuthenticatedUser,sendStripeApiKey)
 module.exports=router;


