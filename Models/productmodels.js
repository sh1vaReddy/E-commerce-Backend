const mongoose=require("mongoose");

const productschem=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    description:{
        type:String,
    },
    price:{
         type:Number,
         required:[true,"enter price value"]
    },
    ratings:{
          default:0,
          type:Number,

    },
    images:[{
        public_id:{
            type:String,
            required:true,
        },
        url:{
              type:String,
              required:true,
        },
    }
    ],
        category:{
            type:String,
            required:true,
        },
        stock:{
            type:Number,
            maxlength:[4,"stock cannont exceed more then 4 charcters"],
            default:1,
        },

        numofReviews:{
            type:Number,
            default:0,
        },
        reviews:[{
         user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                require:true
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                default:0,
            },
            Comment:{
                type:String,
                required:true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    

},);


module.exports=mongoose.model("product",productschem)