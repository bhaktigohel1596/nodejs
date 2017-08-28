var express = require('express');
var controller = require('./subCategory.controller');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;


router.post('/addupdate-subCategory', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.addUpdateSubCategory);
router.get('/get-subCategory/:subCategoryID?/:activeStatus?', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.getSubCategory);
router.delete('/remove-subCategory/:subCategoryID?', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.deleteSubCategory);
router.get('/getAllData/:id?',middleware.checkAccessToken ,middleware.userRightsByAPI ,middleware.logger,controller.joinOnCategory)
