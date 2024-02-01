const catheAsycError = require("../middleware/catchAsyc")
const stripe = require("stripe")("sk_test_51NH2wTSBIv2IdYCLAAkeAF193eq96tbGRthSiOH62AGlqSbFgHsLGcvLL4GC7y4i0Ygn873hZKEBlhs3isSIc9yh00sxVXsHG7");

 
exports.processPayment = catheAsycError(async (req, res, next) => {
  try {
    const mypayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'inr', 
      metadata: {
        company: 'ecommerce', 
      }
    });
    res.status(200).json({ success: true, client_secret: mypayment.client_secret }); 

  }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
   
})


exports.sendStripeApiKey=catheAsycError(async(req,res,next)=>
{
    res.status(200).json({stripeApiKey:process.env.
      STRIPE_PUBLISHABLE_KEY_MY})
})




