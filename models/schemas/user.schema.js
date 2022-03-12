const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
    },
    email:{
        type:String,
    },
    tokens:[String],
    deleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

module.exports=userSchema;