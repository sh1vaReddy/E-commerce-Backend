const ErrorHAndler = require("../utils/errorhandlers");
const catheAsycError = require("../middleware/catchAsyc");
const Product = require("../Models/productmodels");
const  Order=require("../Models/ordermodel")

//create new order
exports.newOrder = catheAsycError(async (req, res, next) => {
  const {
    shipingInfo,
    orderItems,
    paymentInfo,
    iteamprice,
    taxprice,
    shipingprice,
    totalprice,
  } = req.body;

  const order = await Order.create({
    shipingInfo,
    orderItems,
    paymentInfo,
    iteamprice,
    taxprice,
    shipingprice,
    totalprice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    sucess: true,
    message: "Order scuessfuly placed",
    order,
  });
});


// get Single Order
exports.getSingleorder = catheAsycError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

 

  if (!order) {
    return next(new ErrorHAndler("order not found", 404));
  }

  res.status(200).json({
    sucess: true,
    order,
  });
});

// get logged in user  Orders
exports.MyOrders = catheAsycError(async (req, res, next) => {
  console.log(req)
    const order = await Order.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      order,
    });
  });

  //get all order admin 

  exports.getAllorder = catheAsycError(async (req, res, next) => {
      const order = await Order.find();
      console.log(order)
      let totalamount=0;
      order.forEach(order => {
        totalamount+=order.totalprice;
      });
      res.status(200).json({
        success: true,
        order,
        totalamount,
      });
    });


   //update order status --admin
    exports.updatestatusorder = catheAsycError(async (req, res, next) => {
      const order = await Order.findById(req.params.id);
      
      if(!order){
        return next(new ErrorHAndler("NO product are there with this id",404))
      }

      if(order.status==="Delivered")
      {
        return next(new catheAsycError("you have alredy deliverd this product",400))
      }

      if(req.body.status==="Shipped")
      {

        order.orderItems.forEach(async(o)=>
        {
          await updateStock(o.product,o.quantity)
        })
      }
     

      order.orderItems.forEach(async(order)=>{
       await updateStock(order. product,order.quantity);
      })
     
     order.orderStatus=req.body.status;
     

      if(req.body.status==="Delivered")
      {
        order.delivereAT=Date.now( );
      }
      await order.save({validateBeforeSave:false})
      res.status(200).json({
        success: true,
        order,
      });
    });

    async function updateStock (id,quanity) {
      const product=await Product.findById(id);
      product.stock=product.stock-quanity;

      await product.save({validateBeforeSave:false});
    }

    //delete orders --admin

    
  exports.deleteorder = catheAsycError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
      return next(new ErrorHAndler("NO product are there with this id",404))
    }
    await order.deleteOne()
    res.status(200).json({
      success: true,
  
    });
  });

  
  
