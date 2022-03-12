const { getResponse } = require("../common/response");
const {jwtVerifyPromise}=require('../config/jwt.config');
const { userModel } = require("../models");

module.exports={
    cors(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization, Oauth-token, oauth-token");
        next();
    },
    checkToken:async (req,res,next)=>{
        try{
            let token = req.headers['authorization'] || req.headers['Authorization'];
            if(!token) throw "AUTH_TOKEN REQUIRED";
            token=token.replace("Bearer ","");
            let payload=await jwtVerifyPromise(token);
            req.user=await userModel.findOne({_id:payload._id});
            if(!req.user) throw "User Not Found";
            next();
        }catch(err){
            res.json(getResponse('002',{},err.message || err));
        }
    },
    getClientIp:function(req,res,next){
        req.ip=req.connection.remoteAddress;
        next();    
    },
    checkPermission:FUNC_CODE=>{
        return (req,res,next)=>{
            try{
                if(!req.payload) throw "UnAuthorized Access";
                let per=permissions[req.payload.authType];
                if(!per) throw "Invalid AuthType";
                if(!per.find(p=>p==FUNC_CODE)) throw "Access Forbidden";
                next();
            }catch(err){
                res.json(getResponse('002',{},err.message || err));
            }
        }
    }
}