const fs=require('fs');
const mime=require('mime');
const { ROOT_PATH } = require('../common/const');
const { getResponse } = require('../common/response');
const { scanFolders } = require('../common/util');

function getExPath(username,path,l=false,up=false){
    if(!path) path='/';
    if(path[0]!='/') path='/'+path;
    if(l && path[path.length-1]!='/') path=path+'/';
    let O_P=ROOT_PATH+'/'+username+path;
    return up?[O_P,path]:O_P;
}

module.exports={
    getParticulars:async (req,res)=>{
        try{
            let path=req.body.path || req.query.path || '';
            let fileType=req.body.fileType || req.query.fileType || '';
            let nodes=scanFolders(path,ROOT_PATH+"/"+req.user.username,fileType);
            res.json(getResponse('005',{nodes}));
        }catch(e){
            res.status(500).json(getResponse('006',{},err.message || err));   
        }
    },
    getFolderContents:async (req,res)=>{
        try{
            let FOLDER_PATH=req.body.FOLDER_PATH || req.query.FOLDER_PATH;
            let R_P=getExPath(req.user.username,FOLDER_PATH);
            let files=fs.readdirSync(R_P);
            files=files.filter(f=>f[0]!=".").map(f=>{
                let obj={
                    name:f,
                    mimeType:'dir',
                    ext:'dir'
                }
                try{
                    let children=fs.readdirSync(R_P+'/'+f);
                    // return {name:f,mimeType:"dir",ext:'dir'}
                }catch(err){
                    let type=mime.getType(f)
                    obj.mimeType=type;
                    obj.ext=mime.getExtension(type)
                    // return {name:f,mimeType:type,ext:mime.getExtension(type)}
                }
                return obj;
            });
            res.json(getResponse('005',{files,path:FOLDER_PATH}));
        }catch(err){
            res.status(500).json(getResponse('006',{},err.message || err));
        }
    },
    renameFileOrFolder:async (req,res)=>{
        try{
            let {newName,oldName}=req.body;
            if(!newName || !oldName) throw new ClientError("NewName and OldName Required")
            
            let path=getExPath(req.user.username,req.body.path,true);
            let op=path+oldName;
            let np=path+newName;
            console.log(op,np);
            if(fs.existsSync(np)) throw "A File/Folder Already Exists with Same Name:";
            fs.renameSync(op,np);
            res.json(getResponse('009',{}))
        }catch(err){
            res.status(err.status || 500).json(getResponse('010',{},err.message || err));
        }
    },
    share:async (req,res)=>{
        try{
            res.json(getResponse('003',{link:"http"}))
        }catch(err){
            res.status(err.status || 500).json(getResponse('010',{},err.message || err));
        }
    },
    getSharedFile:async (req,res)=>{
        try{
            
            // res.json(getResponse('005',{link:"http"}))
        }catch(err){
            res.status(err.status || 500).json(getResponse('006',{},err.message || err));
        }
    },
    mvDirect:async (req,res)=>{
        try{
            let {newPath,oldPath,fileName}=req.body;
            console.log(newPath,oldPath,fileName);
            if(!newPath || !oldPath || !fileName) throw new ClientError("NewPath, oldPath, fileName Required")
            if(newPath == oldPath) throw "Already in Same Path";
            let np=getExPath(req.user.username,newPath,true);
            let op=getExPath(req.user.username,oldPath,true);
            fs.renameSync(op+fileName,np+fileName);
            res.json(getResponse('009',{}));
            // if(fs.existsSync(np)) throw "A File/Folder Already Exists with Same Name:";
        }catch(err){
            res.status(err.status || 500).json(getResponse('010',{},err.message || err));
        }
    },
    createAFolder:(req,res)=>{
        try{
            let {name}=req.body;
            // if(!name) throw {status:400,message:"Name Required"}
            let [path,mpath]=getExPath(req.user.username,req.body.path,true,true);
            
            if(!name || name.indexOf('New Folder')!=-1){
                let d=fs.readdirSync(path).filter(f=>f.indexOf('.')==-1).filter(f=>f.indexOf('New Folder')!=-1);
                if(name){
                    if(d.find(f=>f==name)){
                        name=`${name}(${d.filter(f=>f)})`
                    }
                }
                if(!name){
                    name=d.length==0?'New Folder':`New Folder(${d.length})`
                }
            }        
            
            fs.mkdirSync(path+name,{recursive:true});
            // res.json({message:"Folder Created At Path "+path})
            res.json(getResponse('003',{folder:{path:mpath,name,mimeType:'dir',ext:'dir'}}))
        }catch(err){
            res.status(500).json(getResponse('004',{},err.message || err));
        }
    },
    deleteAFolderOrFile:(req,res)=>{
        try{
            let {path}=req.body;
            if(!path) throw new ClientError("FolderPath Required");
            if(path=="/") throw new ClientError("Cannot Delete Root Folder");
            path=getExPath(req.user.username,path)
            if(mime.getType(path)){
                fs.unlinkSync(path);
            }else{
                fs.rmdirSync(path,{recursive:true});
            }
            res.json(getResponse('009',{},"Folder Deleted Successfully"));
        }catch(err){
            res.status(err.status || 500).json(getResponse('010',{},err.message || err));
        }
    },
    uploadAFile:async (req,res)=>{
        try{
            let path=getExPath(req.user.username,req.body.path,true);

            if(req.files.length==0) throw "Files Required";

            req.files.forEach(file=>{
                let fp=path+file.originalName;
                if(fs.existsSync(fp)){
                    let [name,ext]=file.originalName.split('.')
                    let len=fs.readdirSync(path).filter(f=>f.indexOf(name)!=-1).length;
                    console.log(fs.readdirSync(path));
                    fp=`${path}${name}(${(Number(len)+1)}).${ext}`;
                }
                fs.writeFileSync(fp,file.value.trim(),file.fileType);     
            });
            // res.json({body:req.body,files:req.files});
            res.json(getResponse('003',{body:req.body,files:req.files}));
        }catch(err){
            // res.status(err.status || 500).json({message:err.message || err});
            res.status(err.status || 500).json(getResponse('004',{},err.message || err));
        }   
    },
    async readFile(req,res){
        try{
            let filePath=req.body.filePath || req.query.filePath;
            if(!filePath) throw {status:400,message:"File Path Required"};
            let fp=getExPath(req.user.username,filePath);
            let stream=fs.createReadStream(fp);
            stream.pipe(res);
            // res.json(getResponse('005',{body:req.body,files:req.files}));
        }catch(err){
            res.status(err.status || 500).json(getResponse('006',{},err.message || err));
        }
    }
}

