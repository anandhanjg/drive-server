const express=require('express');
const { setMiddlewares } = require('./middleware');
const { setRoutes } = require('./routes');
const mongoConnect=require('./config/mongoose.config');
const app=express();
const https=require('https');
let myDomain="anandhan.ddl.link"
setMiddlewares(app,express);
setRoutes(app,express);
const server=https.createServer({
    key:fs.readFileSync(`/etc/letsencrypt/live/${myDomain}/privkey.pem`),
    cert:fs.readFileSync(`/etc/letsencrypt/live/${myDomain}/fullchain.pem`)
},app)
mongoConnect.connection.on('connected',async ()=>{
    server.listen(4000,()=>{
        console.log("SERVER IS RUNNING ON PORT 4000")
    })
});






