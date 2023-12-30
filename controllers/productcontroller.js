 const Product=require('../Models/productmodels')
const ErrorHAndler = require("../utils/errorhandlers");
const catheAsycError = require("../middleware/catchAsyc");
const ApiFeatures = require("../utils/apifeatures");
const User = require("../Models/usermodel");
require('dotenv').config()
const ErrorHAndlers = require("../utils/errorhandlers");
const cloudinary=require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



//create a product --Admin
exports.centreproduct = catheAsycError(async (req, res) => {
  let images=[];


  if(typeof req.body.images === "string")
  {
    images.push(req.body.images)
  }
  else{
    images=req.body.images

  }
 
  const imagesLink = [];
  
  
  for(let i=0;i<images.length;i++)
  {
      const result=await cloudinary.v2.uploader.upload(images[i],{
        folder:"products"
      })

      imagesLink.push({
        public_id:result.public_id,
        url:result.secure_url
      })
  }

  req.body.images=imagesLink
  req.body.user=req.user.id

  const newProduct = await Product.create(req.body);
   res.status(200).json({
    success: true,
    newProduct,
  });
});

//get all product
exports.getallproduct = catheAsycError(async (req, res) => {
  const resultpage = 8;
  const productscount = await Product.countDocuments();
  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
      let products=await apifeatures.query;
      let filterProductsCOunt=products.length;
    apifeatures.pagenation(resultpage)
 
    products = await apifeatures.query.clone();


    return res.status(200).json({
      success: true,
      products,
      productscount,
      resultpage,
      filterProductsCOunt
    });
  });

//get product-all details

exports.getproductdetails= async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};


//update product --Admin
exports.updateproduct = catheAsycError(async (req, res, next) => {

  
  let product = await Product.findById(req.params.id);


  let images=[];


  if(typeof req.body.images === "string")
  {
    images.push(req.body.images)
  }
  else{
    images=req.body.images

  }


  if(images !== undefined)
  {
    for(let i=0;i < product.images.length;i++)
    {
      const result=await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

  }
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product is not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catheAsycError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

exports.productreview = catheAsycError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  try {
    // Attempt to find the product by ID
    const product = await Product.findById(productId);

    // Check if the product is null
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment; // Fix: use lowercase 'comment'
        }
      });
    } else {
      product.reviews.push(review);
      product.numofReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Successfully saved your reviews",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


//get all product review
exports.getallreview=catheAsycError(async(req,res,next)=>{
  const product=await product.findById(req.query.id);

  if(!product){
    return next(new ErrorHAndlers("product Not found",404));
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})

//delete all product

exports.deletereview=catheAsycError(async(req,res,next)=>{
  const product=await product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHAndlers("product Not found",404));
  }

  const review=product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString());

  let avg=0;
  reviews.forEach(rev=>{
    avg+=rev.rating
  })

    const ratings=avg/review.length;

    const numofReviews=review.length;

    await product.findByIdAndUpdate(req.query.productId,review,ratings,numofReviews),{
      new:true,
      validator:true,
      useFindAndModify:false
    };

  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })

})

//Admin products
exports.getAdminproducts = catheAsycError(async (req, res) => {

 

  const products=await Product.find()

    return res.status(200).json({
      success: true,
      products,
  });
});
