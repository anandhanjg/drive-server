let toSpecialCharacters={
    "2F":"\/",
    "20":"\ ",
    "22":"\"",
    "27":"\'",
    "3A":"\:",
    "3B":"\;",
    "3F":"\?",
    "3D":"\=",
    "3C":"\<",
    "3E":"\>",
    "23":"\#",
    "25":"\%",
    "7B":"\{",
    "7D":"\}",
    "7C":"\|",
    "5C":"\\",
    "5E":"\^",
    "7E":"\~",
    "5B":"\[",
    "5D":"\]",
    "60":"\`",
    "26":"\&",
    "40":"\@",
    "21":"\!",
    "2C":"\,"
}

function revertJson(obj){
    let obj1={}
    for(let key in obj){
        obj1[`${obj[key]}`]=key
    }
    return obj1;
}
let toSpecialCodes=revertJson(toSpecialCharacters);
module.exports={
    createQuery(obj){
        let str="";
        let conSplChar=(str)=>{
            let str1="";
            for(var i=0;i<str.length;i++){
                let ch=str[i]
                str1=str1+((toSpecialCodes[ch] && "%"+toSpecialCodes[ch]) || ch || "")
            }
            return str1;
        }
        for(let key in obj){
            str+=`${conSplChar(key)}=${conSplChar(obj[key])}&`
        }
        return str.substring(0,str.length-1);
    },
    queryParse(string){
        let result={};
        if(!string){
            return result;
        };
        if(string.startsWith("?")){
            string=string.replace("?","")
        }
        const conSplChar=(str)=>{
            let str1="";
            for(var i=0;i<str.length;i++){
                if(str[i]=="%"){
                    console.log(str.substr(i,3));
                    str1+=toSpecialCharacters[str.substr(i+1,2)]
                    i+=2;
                    continue;
                }else{
                    str1+=str[i];
                }
            }
            return str1;
        }
        let keyValues=string.split('&').filter(v=>v!="");
        keyValues.forEach(s => {
            let [key,value]=s.split("=");
            result[`${conSplChar(key)}`]=conSplChar(value)
        });
        return result;
    }  
}