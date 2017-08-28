var tbl_SubCategoryMasterBhakti = "tbl_SubCategoryMasterBhakti";
var tbl_CategoryMaster = "tbl_CategoryMaster";

var query = {
  createSubCategory: {
    table: tbl_SubCategoryMasterBhakti,
    insert: []
  },
  updateSubCategory: {
    table: tbl_SubCategoryMasterBhakti,
    update: [],
    filter: {
      field: 'pk_subCategoryId',
      operator: 'EQ',
      value: ''
    }
  },
  getSubCategoryQuery: {
    table: tbl_SubCategoryMasterBhakti,
    select: [{
      field: 'pk_subCategoryId',
      alias: 'subCategory_id'
    }, {
      field: 'subCategory',
      alias: 'subCategory_name'
    }, {
      field: 'discription',
      alias: 'discription'
    }, {
      field: 'imageName',
      alias: 'image_name'
    }, {
      field: 'isActive',
      alias: 'is_active'
    },{
      field: 'fk_categoryId',
      alias: 'category_id'
    },{
      field: 'createdDate',
      alias: 'created_date'
    },{
      field: 'modifiedDate',
      alias: 'modified_date'
    }],
    filter: {}
  },
  checkSubCateGoryValidQuery: {
    table: tbl_SubCategoryMasterBhakti,
    select: [{
      field: 'pk_subCategoryId',
      alias: 'subCategoryid'
    }, {
      field: 'imageName',
      alias: 'imageName'
    }],
    filter: {

    },
  },
  removeSubCategoryQuery: {
    table: tbl_SubCategoryMasterBhakti,
    delete: [],
    filter: {
      field: 'pk_subCategoryId',
      operator: 'EQ',
      value: ''
    }
  },
  checkCateGoryValidQuery : {
    table: tbl_CategoryMaster,
    select: [{
      field: 'pk_categoryID',
      alias: 'categoryID'
    }, {
      field: 'imageName',
      alias: 'imageName'
    }],
    filter: {

    },
  },
  joinCtgSubCtgQuery:{
    join:{
      table : tbl_SubCategoryMasterBhakti,
      alias : 'subCtg',
      joinwith: [{
        table :tbl_CategoryMaster,
        alias : 'Ctg',
        joincondition : {
          and : [{
            table : 'subCtg',
            field : 'fk_categoryId',
            operator : 'eq',
            value : {
              table : 'Ctg',
              field : 'pk_categoryID'
            }
          }]
        }
      }]
    },
    select : [{
      field : 'Ctg.pk_categoryID',
      encloseField : 'false',
      alias : 'category_id'
    },{
      field : 'Ctg.fk_createdBy',
      encloseField : 'false',
      alias : 'created_by'
    },{
      field : 'Ctg.category',
      encloseField : 'false',
      alias : 'category_name'
    },{
      field : 'subCtg.pk_subCategoryId',
      encloseField : 'false',
      alias : 'subCategory_id'
    },{
      field : 'subCtg.subCategory',
      encloseField : 'false',
      alias : 'subCategory_name'
    },{
      field : 'subCtg.isActive',
      encloseField : 'false',
      alias : 'is_active'
    },{
      field : 'subCtg.discription',
      encloseField : 'false',
      alias : 'discription'
    }]
  },


}

module.exports = query;
