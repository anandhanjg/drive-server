const express=require('express');
const { setMiddlewares } = require('./middleware');
const { setRoutes } = require('./routes');
const mongoConnect=require('./config/mongoose.config');
const app=express();

setMiddlewares(app,express);
setRoutes(app,express);

mongoConnect.connection.on('connected',async ()=>{
    app.listen(4000,()=>{
        console.log("SERVER IS RUNNING ON PORT 4000")
    })
});






