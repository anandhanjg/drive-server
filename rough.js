// let mime=require('mime');
// const fs=require('fs');
// let nodes=[]
// let ROOT_PATH="./uploads"
// function show(path="/",root=ROOT_PATH,fileType=""){
//     let ap=root+path;
//     try{

const { ROOT_PATH } = require("./common/const");
const { scanFolders } = require("./common/util");

    
//         console.log(fs.lstatSync(ap))        
//         let children=fs.readdirSync(ap);
//         if(path!='' && !fileType)
//             nodes.push({
//                 name:path.split('/').pop(),
//                 type:'dir',
//                 path
//             })
        
//         for(var i=0;i<children.length;i++){
//             show(path+"/"+children[i],root,fileType);
//         }
//     }catch(e){
//         if(mime.getType(path)){
//             if((fileType && mime.getType(path).indexOf(fileType)!=-1) || !fileType){
//                 nodes.push({
//                     name:path.split('\/').pop(),
//                     type:mime.getType(path),
//                     path
//                 });
//             } 
//         }
//     }
// }

// show('/anandhanjg',ROOT_PATH);

let nodes=scanFolders('/anandhanjg',ROOT_PATH,'image');
nodes.forEach(node=>{
    console.log(node);
})

