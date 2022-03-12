const multer=require('multer');
const mime=require('mime');
const fs=require('fs');
const uuid=require('uuid4');
const { CSV_UPLOAD_PATH } = require('../common/const');
const getStorage=(dest,keepOriginalName)=>{
    return multer.diskStorage({
        destination:(req,file,cb)=>{
            fs.mkdir(dest,{recursive:true},()=>{
                cb(null,dest);
            });
        },
        filename:(req,file,cb)=>{
            if(!keepOriginalName)
                file.originalname=uuid()+Date.now()+'.'+mime.getExtension(file.mimetype);
            cb(null,file.originalname);
        }
    })
}

const getFileFilter=(...fileTypes)=>{
    return function(req,file,cb){
        const ext=mime.getExtension(file.mimetype); 
        if(!fileTypes.find(fType=>fType==ext))
            req.fileError=`${ext} File Not Allowed Here`   
        cb(null,true);
    }
}

module.exports={
    multerPublic:multer({
        storage:getStorage('./uploads/public'),
        fileFilter:getFileFilter('jpeg','jpg','png','webp','gif')
    }),
    multerPicture:multer({
        storage:getStorage('./uploads/pics'),
        fileFilter:getFileFilter('jpeg','jpg','png','webp','gif')
    }),
    multerSlide:multer({
        storage:getStorage('./uploads/pics'),
        fileFilter:getFileFilter('jpeg','jpg','png','webp','gif')
    }),
    multerUpload:multer({
        storage:getStorage('./'+CSV_UPLOAD_PATH),
        fileFilter:getFileFilter("csv")
    })
}