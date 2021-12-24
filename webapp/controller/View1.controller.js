sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function (Controller, FilterOperator, Filter) {
	"use strict";

	return Controller.extend("com.airdit.Routing.controller.View1", {
		onInit: function () {
				this.oRouter = this.getOwnerComponent().getRouter();
		},
		onNext: function(sIndex)
		{
			this.oRouter.navTo("detail",{
				Id: sIndex
			});
		},
		onItemSelection: function(oEvent){
			var oSelectedItem = oEvent.getParameter("listItem");
            var sPath = oSelectedItem.getBindingContext().getPath();
             var sIndex = sPath.split("/")[sPath.split("/").length - 1];
             
             this.onNext(sIndex);
		},
		onSearch: function(oEvent){
			 var sQuery = oEvent.getParameter("newValue");
			 var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
			 this.getView().byId("idList").getBinding("items").filter(oFilter);
		}
	});
});