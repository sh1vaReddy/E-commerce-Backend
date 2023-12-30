const sendtoken=(user,statusCode,res)=>{
 const token=user.getJWTToken();

 //option to cokeie
 const options= {
    expires:new Date(Date.now()+process.env.COOKIE_Expire*24*60*1000),
    httpOnly:true,
}
res.status(statusCode).cookie('token',token,options).json({
    sucess:true,
    user,
    token,
});
};

module.exports=sendtoken; 