const errorhandlers=require('../utils/errorhandlers');
const catheasycError=require('../middleware/catchAsyc');
const User=require('../Models/usermodel');
const sendtoken = require('../utils/jwttoken');
const {sendEmail}=require('../utils/sendemail')
const crypto=require('crypto');
const cloudinary=require('cloudinary');



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.registerUser = catheasycError(async (req, res, next) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendtoken(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//Login user

exports.login=catheasycError(async(req,res,next)=>{
const{email,password}=req.body;

  if(!email||!password){
    return next(new errorhandlers("Enter correct mail & password",400))
  }
try{
  const user=await User.findOne({email}).select("+password");

  if(!user)
  {
    return next(new errorhandlers("Invaild email or password",401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if(!isPasswordMatched)
  {
    return next(new errorhandlers("Invaild email or password",401));
  }

  sendtoken(user,200,res)
}



  catch(error){
    next(error)
  }

  

})

//logiooout user
exports.logout=catheasycError(async(req,res,next)=>{
  res.cookie("token",null,{
    exprie:new Date(Date.now()),
    httponly:true

  })

 
  res.status(200).json({
    sucess:"true",
    message:"Logout sucesful"
  })
})

//forget password
exports.forgotPassword=catheasycError(async(req,res,next)=>{
  const user=await User.findOne({email:req.body.email})
  if(!user){
    return next(new errorhandlers("User not found",404))
  }

  //get password
  const resettoken=await user.generateResetPasswordToken();
   
  await user.save({validateBeforeSave:false})
  const resetpasswordurl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resettoken}`
 
  console.log(resetpasswordurl)
  const message=`your password reset token is:- \n\n
  ${resetpasswordurl} \n \n If you not request rese password please igonre it`;


  try{

    await sendEmail({
      email:user.email,
      subject:`Ecommerce password recovery`,
      message,

    
    })
    res.status(200).json({
      sucess:true,
      message:`emial send  to ${user.email} sucessfully`
    })

  }
  catch(error){
  user.resettoken=undefined;
  user.restpasswordexprie=undefined;

  await user.save({validateBeforeSave:false})
 return next(new  errorhandlers(error.message,500))
  }
})

exports.resetpassword = catheasycError(async (req, res, next) => {
  const resetPasswordToken= crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorhandlers('Reset password token not found', 400));
  }

  if (req.body.password !== req.body.confirmpassword) {
    return next(new errorhandlers("Passwords do not match", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires= undefined;

  await user.save(); // Save the user with updated password and reset token info
  sendtoken(user, 200, res);
});

//get user details
exports.getuserdetails=catheasycError(async(req,res,next)=>{
  const user=await User.findById(req.user.id)
  res.status(200).json({
    success:true,
    user,
  })

})

//update user details

exports.updatepassword=catheasycError(async(req,res,next)=>{
  const user=User.findById(req.body.id).select('+password')

  const isPasswordMatched=await user.comparePassword(req.body.oldpassword)
  if(!isPasswordMatched)
  {
      return next(new errorhandlers("old password is incorrect",404))
  }

  if(req.body.newpassword !==req.body.confirmpassword)
{
  return next(new errorhandlers("password is not match",400))
}

user.password=req.body.newpassword

await user.save()
 sendtoken(user,200,res)
})


exports.updateprofie=catheasycError(async(req,res,next)=>{

  const newUserdeatils={
    name:req.body.name,
    email:req.body.email,
  }

  if(req.body.avatar!=="")
  {
    const user=await User.findById(req.user.id);
    const imageid=user.avatar.public_id
    console.log(imageid)

    await cloudinary.v2.uploader.destroy(imageid)

    const my_cloud=await cloudinary.v2.uploader.upload(req.body.avatra,{
      folder :"avatra",
      width:150,
      crop:"scale"
    })


   
    newUserdeatils.avatra={
      public_id:my_cloud.public_id,
      url:my_cloud.secure_url
    }
  }

  const user=await User.findByIdAndUpdate(req.user.id,newUserdeatils,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
 res.status(200).json({
  success:true
 })
})

//get all user (admin)

exports.getAlluser=catheasycError(async(req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success:true,
    users
  })

})

//get user single (admin)
exports.getsingleuser=catheasycError(async(req,res,next)=>{
  const users=await User.findById(req.params.id)

  if(!users){
    return next(new errorhandlers(`User Not found with id ${req.params.id}`,404))
  }
  res.status(200).json({
    success:true,
    users
  })

})

exports.updatepassword=catheasycError(async(req,res,next)=>{
  const user=User.findById(req.body.id).select('+password')

  const isPasswordMatched=await user.comparePassword(req.body.oldpassword)
  if(!isPasswordMatched)
  {
      return next(new errorhandlers("old password is incorrect",404))
  }

  if(req.body.newpassword !==req.body.confirmpassword)
{
  return next(new errorhandlers("password is not match",400))
}

user.password=req.body.newpassword

await user.save()
 sendtoken(user,200,res)
})

//update role
exports.updateuserole=catheasycError(async(req,res,next)=>{

  const newUserdeatils={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
  }


const user=await User.findByIdAndUpdate(req.params.id,newUserdeatils,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
 res.status(200).json({
  success:true
 })
})




//delete profile 
exports.deleteprofie=catheasycError(async(req,res,next)=>{
const  user=await User.findById(req.params.id)

if(!user){
  return next(new errorhandlers("user not exist",404))
}

const imageid=user.avatra.public_id

await cloudinary.v2.uploader.destroy(imageid)

await user.remove();
 res.status(200).json({
  success:true
 })
})
