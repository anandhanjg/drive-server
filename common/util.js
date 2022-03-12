const {Types:{ObjectId}}=require('mongoose');
const uuid=require('uuid4');

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
    genUUID:()=>uuid()
}