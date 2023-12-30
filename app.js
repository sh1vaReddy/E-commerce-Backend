const express=require("express")
const app= express();
const cookieparse=require('cookie-parser')
const errormidleer=require("./middleware/error")
const dotenv=require('dotenv')
const bodyParse=require("body-parser")
const fileupload=require("express-fileupload")
const order=require('./routes/orderroute')
const payment=require('./routes/paymentroute')
app.use(cookieparse());
app.use(bodyParse.json({ limit: "10mb" }));
app.use(bodyParse.urlencoded({ extended: true, limit: "10mb" }));
app.use(fileupload());
const user=require("./routes/userroute")
const product=require('./routes/productroute');
const { parse } = require("dotenv");
app.use('/api/v1',product); 
app.use(errormidleer);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment)

dotenv.config({path:"backend/config/config.env"})


module.exports=app;