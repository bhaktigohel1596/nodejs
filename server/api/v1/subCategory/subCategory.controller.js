var debug = require('debug')('server:api:v1:subCategory:controller');
var subCategoryService = require('./subCategory.service');
var constant = require('../constant');

/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategory description]
 * @param {[type]} request  [description]
 * @param {[type]} response [description]
 */
var addUpdateSubCategory = function (request, response) {
  debug("subCategory.controller -> add updateSubCategory");
  if (request.session.userInfo !== undefined) {
    if (Object.keys(request.body).length != 0 && typeof request.body === "object") {
      subCategoryService.addUpdateSubCategoryService(request, function (result) {
        return response.send(result);
      })
    } else {
      return response.send({
        status: false,
        error: constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST
      });
    }
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};

/**
 * [getCategory description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var getSubCategory = function (request, response) {
  debug("subCategory.controller -> get subCategory");
  if (request.session.userInfo !== undefined) {
    subCategoryService.getSubCategoryService(request, function (result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [deleteCategory description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var deleteSubCategory = function (request, response) {
  if (request.session.userInfo !== undefined && request.params !== undefined) {
    subCategoryService.deleteSubCategoryService(request, function (result) {
      debug("result",result);
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};

var joinOnCategory = function(request,responce){
  debug('joincategorycntroller');
  if(request.session.userInfo !== undefined ){
    subCategoryService.joinService(request,function(result){
      return responce.send(result);
    })
  }else{
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
}

module.exports = {
  addUpdateSubCategory: addUpdateSubCategory,
  getSubCategory: getSubCategory,
  deleteSubCategory: deleteSubCategory,
  joinOnCategory:joinOnCategory
};
