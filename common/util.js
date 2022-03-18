const {Types:{ObjectId}}=require('mongoose');
const uuid=require('uuid4');
const { ROOT_PATH } = require('./const');
const mime=require('mime');
const fs=require('fs');
module.exports={
    generateOTP:(digits=6)=>{
        let otp=''
        let i=0;
        while(i<digits)
        {
            let r=Math.floor(Math.random()*10);
            if(r==0)
                continue;
            otp+=r;
            i++;
        }
        return otp;
    },
    deleteFile:filePath=>{
        try{
            fs.unlinkSync(filePath)
        }catch(err){
            console.log(err);
        }
    },
    getObjectId:id=>(ObjectId(id)),
    isEmptyObject:(obj)=>(Object.keys(obj).length==0),
    genAgg:({page,size,sortBy,order})=>{
        console.log("HI");
        let agg=[];
        
        if(sortBy){
            agg.push({
                $sort:{
                    [sortBy]:order?order:1
                }
            })
        }

        if(page && typeof page=='number' && size && typeof size=='number'){
            agg.push({
                $skip:page*size-size
            })
        }

        if(size && typeof size=='number'){
            agg.push({
                $limit:size
            })
        }

        return agg;
    },
    ignoreDelAgg:()=>{
        return [
            {
                $match:{
                    deleted:{
                        $eq:false
                    }
                }
            },
            {
                $unset:["deleted"]
            }
        ]
    },
    datesWithStartAndEnd:(date)=>{
        let d1=date?new Date(date):new Date();
        let d2=date?new Date(date):new Date();
        d1.setUTCHours(0);
        d1.setUTCMinutes(0);
        d2.setUTCHours(23);
        d2.setUTCMinutes(59);
        return [d1,d2];
    },
    genUUID:()=>uuid(),
    scanFolders:(path,root=ROOT_PATH,fileType="")=>{
        let nodes=[];
        const scan=(path)=>{
            let ap=root+path;
            try{
                let children=fs.readdirSync(ap);
                if(path!="" && !fileType){
                    nodes.push({
                        name:path.split('/').pop(),
                        type:'dir',
                        path
                    })
                }
                for(let i=0;i<children.length;i++){
                    scan(path+'/'+children[i]);
                }
            }catch(err){
                let mt=mime.getType(path);
                if(mt){
                    if((fileType && mt.indexOf(fileType)!=-1)||!fileType){
                        nodes.push({
                            name:path.split('/').pop(),
                            type:mt,
                            path
                        })
                    }
                }
            }
        }
        scan(path);
        return nodes;
    }
}