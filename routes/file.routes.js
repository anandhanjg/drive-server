const fileRouter=require('express').Router();
const fileController=require('../controller/file.controller');
const { checkToken } = require('../middleware/common.middleware');

// fileRouter.get('/ls-a',fileController.getFolderContents)

fileRouter.use(checkToken);
fileRouter.get('/ls',fileController.getFolderContents);
fileRouter.post('/mkdir',fileController.createAFolder);
fileRouter.post('/rm',fileController.deleteAFolderOrFile);
fileRouter.post('/touch',fileController.uploadAFile);
fileRouter.post('/mv',fileController.renameFileOrFolder);
fileRouter.get('/read',fileController.readFile);

fileRouter.get('/scan',fileController.getParticulars);
fileRouter.post('/scan',fileController.getParticulars);

module.exports=fileRouter;