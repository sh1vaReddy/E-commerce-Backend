const ErrorHAndler=require("../utils/errorhandlers");


module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Eroor";

//wrong MOngodb Id Error
if(err.name=="CastError"){
    const message=`ReSource not found invaild: ${err.path}`;
    err=new ErrorHAndler(message,400)
}


//Mongoose duplicate key error
if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyvalue)} enterd`
        err=new ErrorHAndler(message,400)
}

//wrong jwt token
if(err.name=="JsonWebTokenError"){
    const message=`Jsonwebtoken is invalid,try again`;
    err=new ErrorHAndler(message,400)
}
//jwt expire error
if(err.name=="TokenExpiredError"){
    const message=`Json web token is expired,try again`;
    err=new ErrorHAndler(message,400)
}



    res.status(err.statusCode).json({
        sucess:false,
        message:err.message,
    });
}

;
