const { compare, getHash } = require('../config/bcrypt.config');
const {jwtSignPromise}=require('../config/jwt.config');
const {userModel}=require('../models');
const {genAgg, ignoreDelAgg}=require('../common/util');
const {getResponse}=require('../common/response');
const fs=require('fs');
module.exports={
    profile:async(req,res)=>{
        req.user=JSON.parse(JSON.stringify(req.user));
        delete req.user.password;
        res.json(getResponse('005',{profile:req.user}));
    },
    login:async ({body:{username,password}},res)=>{
        try{
            if(!username || !password) throw "Username And Password Required";
            let user=await userModel.findOne({username});
            if(!user) throw "Invalid Username";
            if(!(await compare(password,user.password))) throw "Invalid Password";
            let token=await jwtSignPromise({_id:user._id,authType:user.authType}) ;
            res.json(getResponse('001',{token,authType:user.authType}));
        }catch(e){
            res.json(getResponse('002',{},e.message || e))
        }
    },
    fetch:async (req,res)=>{
        try{
            const {authType,searchTxt}=req.body;
            let agg=[...ignoreDelAgg()];
            if(authType){
                agg.push({$match:{authType}})
            }

            agg.push(
            {
                $unset:["password","tokens"]
            });

            if(searchTxt){
                let reg=new RegExp(searchTxt);
                agg.push({
                    $match:{
                        $or:[
                            {
                                username:{
                                    $regex:reg
                                }
                            },
                            {
                                mobile:{
                                    $regex:reg
                                }
                            },
                            {
                                fullName:{
                                    $regex:reg
                                }
                            },
                            {
                                email:{
                                    $regex:reg
                                }
                            }
                        ]
                    }
                })
            }
            agg.push(...genAgg(req.body));
            let users=await userModel.aggregate(agg);
            res.json(getResponse('005',{users}));
        }catch(e){
            res.json(getResponse('006',{},e.message || e))
        }
    },
    add:async (req,res)=>{
        try{
            if(!req.body.password) req.body.password="default@"+req.body.username;
            req.body.password=await getHash(req.body.password);
            let user=await new userModel(req.body).save();
            user=JSON.parse(JSON.stringify(user));
            fs.mkdirSync('./uploads/'+user.username,{recursive:true});
            delete user.password;
            delete user.tokens;
            res.json(getResponse('003',{user}));
        }catch(e){
            res.json(getResponse('004',{},e.message || e))
        }
    },
    edit:async (req,res)=>{
        try{
            let _id=req.body._id;
            if(!_id) throw {status:400,message:"ID REQUIRED"};
            delete req.body._id;
            let info=await userModel.updateOne({_id},{$set:req.body});
            res.json(getResponse('007',{info}));
        }catch(e){
            res.json(getResponse('008',{},e.message || e))
        }
    },
    delete:async (req,res)=>{
        try{
            let _id=req.params.id;
            if(!_id) throw {status:400,message:"ID REQUIRED"};
            let user=await userModel.findOneAndUpdate({_id},{$set:{deleted:true}});
            if(!user) throw {status:400,message:"User Not Found"};
            user=JSON.parse(JSON.stringify(user));
            delete user.password;
            delete user.tokens;
            res.json(getResponse('009',{user}));
        }catch(e){
            res.json(getResponse('010',{},e.message || e))
        }
    },
    get:async (req,res)=>{
        try{
            let _id=req.params.id;
            if(!_id) throw {status:400,message:"ID Required"};
            let user=await userModel.findOne({_id,deleted:false});
            if(!user) throw {status:400,message:"User Not Found"};
            user=JSON.parse(JSON.stringify(user));
            delete user.password;
            delete user.tokens;
            res.json(getResponse('005',{user}));
        }catch(e){
            res.json(getResponse('006',{},e.message || e))
        }
    }
}