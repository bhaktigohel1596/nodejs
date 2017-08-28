var debug = require('debug')('server:api:v1:inventory:DAL');
var d3 = require("d3");
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./subCategory.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;

/**
 * Created By: CBT
 * Updated By: CBT
 * [createsubCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var createSubCategory = function (fieldValue, cb) {
  debug("subCategory.DAL -> createsubCategory");
  var createSubCategory = common.cloneObject(query.createSubCategory);
  createSubCategory.insert = fieldValue;
  common.executeQuery(createSubCategory, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [updatesubCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {[type]}   subCategoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var updateSubCategory = function (fieldValue, subCategoryID, cb) {
  debug("subCategory.DAL -> updatesubCategory");
  var updateSubCategory = common.cloneObject(query.updateSubCategory);
  updateSubCategory.update = fieldValue;
  updateSubCategory.filter.value = subCategoryID;
  common.executeQuery(updateSubCategory, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [getSubCategory description]
 * @param  {[type]}   dbServerDateTime [description]
 * @param  {[type]}   limit            [description]
 * @param  {Function} cb               [description]
 * @return {[type]}                    [description]
 */
var getSubCategory = function (subCategoryID, isActive, dbServerDateTime, limit, cb) {
  debug("subCategory.DAL -> getSubCategory");
  var getSubCategoryQuery = common.cloneObject(query.getSubCategoryQuery);
  var subCategoryFilter = {
    and: []
  }
  if (subCategoryID > -1) {
    subCategoryFilter.and.push({
      field: 'pk_subCategoryID',
      operator: 'EQ',
      value: subCategoryID
    });
  }
  if (isActive > -1) {
    subCategoryFilter.and.push({
      field: 'isActive',
      operator: 'EQ',
      value: isActive
    });
  }
  if (subCategoryID < 0 && isActive < 0) {
    delete getSubCategoryQuery.filter;
  } else {
    getSubCategoryQuery.filter = subCategoryFilter;
  }

  // getSubCategoryQuery.limit = limit;
  common.executeQuery(getSubCategoryQuery, cb);
};




/**
 * Created By: CBT
 * Updated By: CBT
 * [checkSubCategoryIDValid description]
 * @param  {[type]}   subCategoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var checkSubCategoryIDValid = function (subCategoryID, cb) {
  debug("checksubCategoryValid.DAL -> checksubCategoryValid");
  var checksubCategoryValid = common.cloneObject(query.checkSubCateGoryValidQuery);
  checksubCategoryValid.filter = {
    and: [{
      field: 'pk_subCategoryID',
      operator: 'EQ',
      value: subCategoryID
    }]
  }
  common.executeQuery(checksubCategoryValid, cb);
};


var checkCategoryIDValid = function (categoryID, cb) {
  debug("checkCategoryValid.DAL -> checkCategoryValid");
  var checkCategoryValid = common.cloneObject(query.checkCateGoryValidQuery);
  checkCategoryValid.filter = {
    and: [{
      field: 'pk_categoryID',
      operator: 'EQ',
      value: categoryID
    }]
  }
  common.executeQuery(checkCategoryValid, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeSubCategory description]
 * @param  {[type]}   subCategoryId [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var removeSubCategory = function (subCategoryId, cb) {
  debug("subCategory.DAL -> removeSubCategory");
  var removeSubCategoryQuery = common.cloneObject(query.removeSubCategoryQuery);
  removeSubCategoryQuery.filter.value = subCategoryId;
  common.executeQuery(removeSubCategoryQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [checksubCategoryIsExist description]
 * @param  {[type]}   subCategoryName [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var checkSubCategoryIsExist = function (subCategory, cb) {
  debug("checkSubCategoryIsExist.DAL -> checkSubCategoryIsExist");
  var checkSubCategoryValid = common.cloneObject(query.checkSubCateGoryValidQuery);
  checkSubCategoryValid.filter = {
    and: [{
      field: 'subCategory',
      operator: 'EQ',
      value: subCategory
    }]
  }
  common.executeQuery(checkSubCategoryValid, cb);
};

var ctgJoin = function (cb) {
  debug("joinQuery.DAL -> joinQuery");
  var joinQuery = common.cloneObject(query.joinCtgSubCtgQuery);
  common.executeQuery(joinQuery,cb);
};

module.exports = {
  createSubCategory: createSubCategory,
  updateSubCategory: updateSubCategory,
  getSubCategory: getSubCategory,
  checkSubCategoryIDValid: checkSubCategoryIDValid,
  removeSubCategory: removeSubCategory,
  checkSubCategoryIsExist: checkSubCategoryIsExist,
  checkCategoryIDValid :checkCategoryIDValid,
  ctgJoin : ctgJoin
};
