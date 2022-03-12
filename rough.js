const mime=require('mime');

console.log(mime.getType('png'))


const fs=require('fs');
console.log(fs.existsSync('./uploads/axe007/Personal/Public/Movies/New/xyz.png'));