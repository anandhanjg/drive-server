const mongoose=require('mongoose');
const { collections } = require('../../common/const');

const sharedSchema=new mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:collections.users
    },
    content:String,
    fileName:String,
    mimeType:String,
    path:String
},{timestamps:true})