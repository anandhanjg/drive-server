const fs=require('fs');
const { queryParse, createQuery } = require('../common/qs');

class BodyHandle{
    constructor(){
        this.parseBody=this.parseBody.bind(this);
        this.fileParser=this.fileParser.bind(this);
    }
    
    getBoundary(req){
        let boundary=req.headers['content-type'].split(';').find(i=>i.trim().startsWith("boundary="));
        return boundary?boundary.replace("boundary=",""):null;
    }

    getMatch(string,regex){
        const matches=string.match(regex);
        console.log(matches && matches.length);
        return (matches && matches.length>=2 && matches[1]) || null;
    }

    parseBody(req,res,next){
        req.body={}
        let ct=req.headers['content-type']
        if(!ct) return next();
        if(ct.indexOf('multipart/form-data')!=-1){
            console.log('multipart data');
            req.setEncoding('latin1');
        }else{
            req.setEncoding('utf-8')
        }
        
        let data='';
        req.on('data',(c)=>{
            data+=c;
        }).on('end',()=>{        
            req.rawBody=data;
            console.log(ct);
            if(ct.indexOf('multipart/form-data')!=-1){
                this.fileParser(req,res,next);
            }else if(ct.indexOf('application/json')!=-1){
                this.jsonParser(req,res,next);
            }else if(ct=='application/x-www-form-urlencoded'){
                this.urlEncodedParser(req,res,next);
            }
        });
    }

    urlEncodedParser(req,res,next){
        console.log(createQuery({a:"b",c:"c&a"}))
        req.body=queryParse(req.rawBody);
        next();
    }

    jsonParser(req,res,next){
        req.body=JSON.parse(req.rawBody);
        next();
    }

    fileParser(req,res,next){
        console.log('File Parser Thing');
        let contentType=req.headers['content-type']
            if(!contentType.includes('multipart/form-data')) throw "Multipart Data Required";
            const boundary=this.getBoundary(req).trim();
            let items=req.rawBody.split(boundary).filter(i=>i.indexOf("Content-Disposition")!=-1);
            items.forEach(item=>{
                let name=this.getMatch(item,/(?:name=")(.+?)(?:")/);
                if(!name) return;
                let value=this.getMatch(item,/(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
                if(!value) return;
                let filename=this.getMatch(item,/(?:filename=")(.*?)(?:")/);
                if(filename){
                    filename=filename.trim()
                    // let filepath="./uploads/"+filename;
                    let f={
                        key:name,
                        value,
                        originalName:filename,
                        'Content-Type':this.getMatch(item,/(?:Content-Type:)(.*?)(?:\r\n)/),
                        fileType:'binary',
                        fileSaved:false
                    }
                    // fs.writeFileSync(filepath,value.trim(),'binary')
                    if(!req.files) req.files=[];
                    req.files.push(f);
                }else{
                    req.body[name]=value;
                }
            });
            next();
    }
}

module.exports=new BodyHandle();
