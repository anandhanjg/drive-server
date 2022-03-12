const mongoose=require('mongoose');
const { collections } = require('../common/const');
const userSchema = require("./schemas/user.schema");

module.exports={
    userModel:mongoose.model(collections.users,userSchema)
}