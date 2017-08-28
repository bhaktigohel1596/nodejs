$(document).ready(function () {
  subCategory.init();
});

subCategory = {
  subCategory_id: -1,
  subCategories: [],
  imageObj: {},
  subCategoryTable: {},
  saveDisabled: false,
  init: function () {
    subCategory.subCategories.push({
      name:"category_name",
      width: "20%",
      targets :0
    });
    subCategory.subCategories.push({
      name: "subCategory_name",
      width: "20%",
      targets: 1
    });
    subCategory.subCategories.push({
      name: "discription",
      width: "40%",
      targets : 2
    });


    if (canAddEdit > 0) {
      var buttons = [];
      if (canDelete > 0) {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: subCategory.edit
        }, {
            buttonObj: Constants.staticHtml.deleteButton,
            onClickEvent: subCategory.delete
          });
      } else {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: subCategory.edit
        });
      }
      subCategory.subCategories.push({
        isActionButton: true,
        targets: 4,
        width: "10%",
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: buttons
      })
      subCategory.subCategories.push({
        isActionButton: true,
        targets: 3,
        width: "10%",
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: [{
          buttonObj: Constants.staticHtml.approveButton,
          onClickEvent: subCategory.onActiveClick,
          dataRowField: "is_active",
          compareValue: 1
        }, {
          buttonObj: Constants.staticHtml.rejectButton,
          onClickEvent: subCategory.onActiveClick,
          dataRowField: "is_active",
          compareValue: 0
        }]
      })
    }
    subCategory.getData();
    subCategory.getCategoryName();
  },
  getData: function () {
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    var subCategoryUrl = Constants.Api.joinCtgSubctg
    Api.get(subCategoryUrl, headers, function (error, res) {
      if (error) {
        common.showMessage(error.error.message, true);
      }
      if (res != undefined && res.status == true) {
        subCategory.subCategoryTable = common.bindCommonDatatable(res.content, subCategory.subCategories, "gridSubCategory", objModules.subCategory);
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      }
    });
  },
  save: function (event) {
    var validation = formValidation('frmSubCategory');
    if (subCategory.saveDisabled == false) {
      if (validation == true) {
        subCategory.saveDisabled = true;
        var data = {};
        data = common.getFormValues($("#frmSubCategory"));
        data.subCategory_id = subCategory.subCategory_id;
        data.imageObj = subCategory.imageObj;
        var headers = {
          Authorization: $.cookie(Constants.User.authToken)
        };
        Api.post(Constants.Api.addUpdateSubCategory, headers, data, function (error, res) {
          if (res != undefined && res.status == true) {
            common.showMessage(res.data.message, false);
            subCategory.clearValues(true);
          } else if (res != undefined && res.status == false) {
            common.showMessage(res.error.message, true);
            subCategory.clearValues(false);
          } else if (error != undefined && error.status == false) {
            common.showMessage(error.error.message, true);
            subCategory.clearValues(false);
          }
        });
      } else {
        subCategory.saveDisabled = false;
      }

    }

  },
  clearValues: function (isshowGridDiv) {
    if (isshowGridDiv == true) {
      common.showHideDiv(true, objModules.subCategory);
      subCategory.getData();
      subCategory.subCategoryTable.destroy();
    }
    subCategory.subCategory_id = -1;
    subCategory.saveDisabled = false;
    subCategory.imageObj = {};
    common.clearValues($("#frmSubCategory"));
  },
  cancel: function () {
    subCategory.clearValues(true);
  },
  delete: function (currentRow) {
    common.deleteData(objModules.subCategory, Constants.Api.deleteSubCategory, currentRow.data().subCategory_id, function (res) {
      if (res != undefined && res.status == true) {
        currentRow.remove().draw(false);
        common.showMessage(res.message, false);
      } else {
        common.showMessage(res.errorMsg, true);
      }
    });
  },
  edit: function (currentRow) {
    event.preventDefault();
    var currentSubCategory = currentRow.data();
    if (currentSubCategory != undefined && currentSubCategory.subCategory_id > 0) {
      subCategory.subCategory_id = currentSubCategory.subCategory_id;
      common.showHideDiv(false, objModules.subCategory);
      common.fillFormValues($("#frmSubCategory"), currentSubCategory);
      $('#imageSubCategory').attr("src", currentSubCategory.image_name);
    }
  },
  add: function () {
    common.showHideDiv(false, objModules.subCategory);
    subCategory.clearValues(false);
    $('#imageSubCategory').attr("src", common.getDefaultImage);
  },
  fileupload: function (event) {
    if (subCategory.saveDisabled == false) {
      event.preventDefault();
      // $('#btnSubmit').attr('disabled', 'disabled');
      subCategory.saveDisabled = true;
      common.uploadMedia(event.target.files[0], "image", function (res) {
        if (res.status) {
          // $('#btnSubmit').removeAttr("disabled");
          subCategory.saveDisabled = false;
          subCategory.imageObj = res.objImage;
          $('#imageSubCategory').attr("src", res.url);
        } else {
          common.showMessage(res.errorMsg, true);
          // $('#btnSubmit').removeAttr("disabled");
          subCategory.saveDisabled = false;
          $('#imageSubCategory').attr("src", common.getDefaultImage);
        }
      });
    }

  },
  onActiveClick: function (rowObj) {
    var data = rowObj.data();
    var status = "0";
    if (data.is_active == "0") {
      status = "1";
    }
    common.updateActiveStatus(data.subCategory_id, objModules.subCategory.tableId, status, function (res) {
      if (res != null && res.status == true) {
        subCategory.clearValues(true);
      }
    });
  },
  getCategoryName : function(){
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    var getCategory=Constants.Api.getCategory+'-1/-1';
    Api.get(getCategory, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        subCategory.bindSelect("#drpCategory", res.data, "category_id", "category_name");
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  bindSelect: function (selectId, dataSet, valField, dispValField) {
    try {
      var selectOptions = "";
      for (var i = 0; i < dataSet.length; i++) {
        selectOptions += '<option value="' + dataSet[i][valField] + '">' + dataSet[i][dispValField] + '</option>'
      }
      $(selectId).append(selectOptions);
    } catch (e) {
      throw (e);
    }
  }
}
$('input[name=mediaFile]').on('change', subCategory.fileupload);
