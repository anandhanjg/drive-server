const fileRouter = require("./file.routes");
const userRouter = require("./user.routes");
module.exports.setRoutes=(app,express)=>{
    app.get('/',(req,res)=>{
        res.json({message:"Success"});
    });
    app.use('/user',userRouter);
    app.use('/file',fileRouter);
}