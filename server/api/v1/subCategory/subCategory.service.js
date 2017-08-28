var debug = require('debug')('server:api:v1:inventory:service');
var uuid = require('uuid');
var common = require('../common');
var constant = require('../constant');
var subCategoryDAL = require('./subCategory.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");
var otherService = require('../other/other.service');
var otherDAL = require('../other/other.DAL');
var async = require('async');
var series= require('async/series');
// var storeService = require('../store/store.service');

/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategoryService description]
 * @param {[type]}   request [description]
 * @param {Function} cb      [description]
 */
var addUpdateSubCategoryService = async function (request, cb) {
  debug("subCategory.service -> addUpdateSubCategoryService");
  if (request.body.subCategory_name === undefined || request.body.subCategory_id === undefined || request.body.subCategory_id === "" || request.body.subCategory_name === "" ||request.body.category_id=== undefined || request.body.category_id === "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST
    });
    return;
  }

  var categoryID = request.body.category_id;
  var subCategoryID = request.body.subCategory_id;
  var userID = request.session.userInfo.userId;
  var subCategoryName = request.body.subCategory_name;
  var description = request.body.description;
  var imageObj = request.body.imageObj;
  var image = '';
  subCategoryDAL.checkCategoryIDValid(categoryID, function (result) {
    if (result.status === false) {
      cb(result);
      return;
    }
    if (result.content.length === 0) {
      cb({
        status: false,
        error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE
      });
      return;
    }
    var fileObj = imageObj;
    if (fileObj != undefined && Object.keys(fileObj).length > 0) {

      otherService.imageUploadMoving(fileObj, constant.appConfig.MEDIA_MOVING_PATH.CATEGORY, function (result) {
        if (result.status === false) {
          cb(result);
          return;
        }
        image = result.data.file;
        addUpdateSubCategory(categoryID,subCategoryID, userID, subCategoryName, description, image, request, function (data) {
          cb(data);
          return;
        });
      });
    } else {
      addUpdateSubCategory(categoryID,subCategoryID, userID, subCategoryName, description, image, request, function (data) {
        cb(data);
        return;
      });
    }

  });

};



/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategory description]
 * @param {[type]}   categoryID       [description]
 * @param {[type]}   userID           [description]
 * @param {[type]}   categoryName     [description]
 * @param {[type]}   description      [description]
 * @param {[type]}   image            [description]
 * @param {[type]}   request          [description]
 * @param {Function} cb               [description]
 */
function addUpdateSubCategory(categoryID,subCategoryID, userID, subCategoryName, description, image, request, cb) {
  var fullUrl = common.getGetMediaURL(request);
  var subCategoryinfo = {};
  subCategoryinfo.fk_categoryId = categoryID;
  subCategoryinfo.createdBy = userID;
  subCategoryinfo.subCategory = subCategoryName;
  subCategoryinfo.discription = description;
  if (image != '')
    subCategoryinfo.imageName = image; //   categoryinfo.imageName = fullUrl + image;
  else
    subCategoryinfo.imageName = '';

  var subCategoryKeys = Object.keys(subCategoryinfo);
  var fieldValueInsert = [];
  subCategoryKeys.forEach(function (subCategoryKey) {
    if (subCategoryinfo[subCategoryKey] !== undefined) {
      var fieldValueObj = {};
      fieldValueObj = {
        field: subCategoryKey,
        fValue: subCategoryinfo[subCategoryKey]
      }
      fieldValueInsert.push(fieldValueObj);
    }
  });
  if (subCategoryID <= 0) {
    debug("resulted final Add category object -> ", fieldValueInsert);
    var res;
    async.series([
      function checkSubCategoryIsExist (cb){
        subCategoryDAL.checkSubCategoryIsExist(subCategoryinfo.subCategory,function(result){
          if(result.status === true && result.content.length !=0){
            cb({
              status: false,
              error: constant.categoryMessages.ERR_CATEGORY_EXIST,
            },null);
            return;
          }
          res=result;
          cb(null,res);
          return;
        });
      },
      function createSubCategory(cb){
        subCategoryDAL.createSubCategory(fieldValueInsert,function(result){
          debug("result",result);
          if(result.status === false){
            cb(result,null);
            return;
          }
          cb(null,result);
        });
      }
    ],
    function (err) {
      if(err){
        cb(err);
        return;
      }
      cb({
        status:true,
        data: constant.categoryMessages.CATEGORY_ADD_SUCCESS,
      });
    });

  } else {
    modifiedObj = {
      field: "modifiedDate",
      fValue: d3.timeFormat(dbDateFormat)(new Date())
    }
    var res;
    async.series([
      function checkSubCategoryIDValid(cb){
        subCategoryDAL.checkSubCategoryIDValid(subCategoryID,function (result) {
          debug("1111111111111",result);
          if(result.status===false){
              cb(result,null);
              return;
          }
          if(result.content.length ===0){
            cb({
                  status: false,
                  error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_UPDATE
                },null);
            return;
          }
          if (result.content[0].imageName != "" && result.content[0].imageName != undefined && fieldValueInsert[3].fValue == "")
              fieldValueInsert[3].fValue = result.content[0].imageName;

            fieldValueInsert.push(modifiedObj);
            res=result;
            cb(null,res);
        });
      },
      function updateSubCategory(cb){
        subCategoryDAL.updateSubCategory(fieldValueInsert,subCategoryID,function(result){
          if(result.status===false){
            cb(result,null);
          }else{
            cb(null,result);
          }
        })
      }
    ],
    function(err){
      if(err){
        cb(result);
        return;
      }
      cb({
        status: true,
        data: constant.categoryMessages.CATEGORY_UPDATE_SUCCESS
      });
    })

  }
}
/**
 * Created By: CBT
 * Updated By: CBT
 * [getCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getSubCategoryService = function (request, cb) {
  debug("subCategory.service -> getsubCategoryService");

  var getPaginationObject = common.getPaginationObject(request);
  var dbServerDateTime = getPaginationObject.dbServerDateTime;
  var limit = getPaginationObject.limit;
  var pageNo = getPaginationObject.pageNo;
  var serverDateTime = getPaginationObject.serverDateTime;
  var subCategoryID = request.params.subCategoryID;

  var activeStatus = 1;
  if (request.params.activeStatus != undefined && request.params.activeStatus != "") {
    if (constant.appConfig.VALID_ACTIVE_STATUS_PARAM.indexOf(request.params.activeStatus) > -1) {
      activeStatus = request.params.activeStatus;
    } else {
      cb({
        status: false,
        error: constant.otherMessage.INVALID_ACTIVE_PARAM
      });
      return;
    }
  }

  subCategoryDAL.getSubCategory(subCategoryID, activeStatus, dbServerDateTime, limit, function (result) {
    debug("get sub category",result);
    if (result.status == false) {
      cb({
        status: false,
        error: constant.categoryMessages.ERR_NO_CATEGORY_FOUND
      });
      return;
    } else {
      var fullUrl = common.getGetMediaURL(request);
      result.content.forEach(function (category) {
        debug("result :" ,result.content);

        if (category.image_name != undefined && category.image_name != "") {
          category.image_name = common.getGetMediaURL(request) + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY + "large/" + category.image_name;
        } else {
          category.image_name = common.getNoImageURL(request);
        }
      });
      cb({
        status: true,
        data: result.content
      });
    }
  });
};



/**
 * Created By: CBT
 * Updated By: CBT
 * [deleteCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var deleteSubCategoryService = function (request, cb) {
  debug("subCategory.service -> deleteSubCategoryService");
  if (request.params.subCategoryID === undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_DELETE_REQUEST
    });
    return;
  } else {
    var subCategoryID = request.params.subCategoryID;
    // var userID = request.session.userInfo.userId;
    var res;
    async.series([
      function checkSubCategoryIDValid(cb){
        subCategoryDAL.checkSubCategoryIDValid(subCategoryID,function (result) {
          if (result.status === false) {
             cb(result,null);
             return;
           }
           if (result.content.length === 0) {
             cb({
               status: false,
               error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE
             },null);
             return;
           }
           cb(null);
        })
      },
      function removeSubCategory(cb) {
        subCategoryDAL.removeSubCategory(subCategoryID,function (result) {
          debug("delete result :",result)
          if (result.status === false) {
                cb(result,null);
                return;
          }
          cb(null,result);
        });
      }
    ],function(err){
      if(err){
        cb(err);
        return;
      }
      cb({
        status: true,
        data: constant.categoryMessages.MSG_CATEGORY_REMOVE_SUCCESSFULLY
      });
    });
  }
};

var joinService = function(request,cb){
  debug('joinService.DAL -> joinService');
    subCategoryDAL.ctgJoin(function(result){
      debug("join result",result);
      if (result.status === false) {
        cb(result);
        return;
      }
      if (result.content.length === 0) {
        cb({
          status: false,
          error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE
        });
        return;
      }
      if(result.status ===true){
        cb(result);
        return;
      }
    });

}


module.exports = {
  addUpdateSubCategoryService: addUpdateSubCategoryService,
  getSubCategoryService: getSubCategoryService,
  deleteSubCategoryService: deleteSubCategoryService,
  joinService :joinService
};
