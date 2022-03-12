const userController = require('../controller/user.controller');
const { checkToken } = require('../middleware/common.middleware');

const userRouter=require('express').Router();

userRouter.post('/login',userController.login);
userRouter.post("/register",userController.add);

userRouter.use(checkToken);
userRouter.get('/profile',userController.profile);
// userRouter.get("/:id",userController.get);
userRouter.put("/update",userController.edit);
userRouter.delete("/:id",userController.delete);
// userRouter.post("/list",userController.fetch);

module.exports=userRouter;