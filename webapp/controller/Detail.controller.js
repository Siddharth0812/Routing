sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function (Controller, FilterOperator, Filter) {
	"use strict";

	return Controller.extend("com.airdit.Routing.controller.Detail", {
		onInit: function () {
	this.oRouter = this.getOwnerComponent().getRouter();
	this.oRouter.getRoute("detail").attachMatched(this.Navigate.bind(this));
		},
		onSearch1: function(oEvent){
			var sQuery = oEvent.getParameter("newValue");
			var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
			this.getView().byId("MobileTable").getBinding("items").filter(oFilter);
		},
		
		Navigate: function(oEvent){
            //Step 1: Read the value of variable which contains fruit id sent fron first view
            var sFruitId = oEvent.getParameter("arguments").Id;
            //Step 2: Build the path
            var sPath = "/fruits/" + sFruitId;
            //Step 3: Bind the element to set the data on V2
            this.getView().bindElement(sPath);
        },
         onBack: function(){
            this.getView().getParent().getParent().to("idV2");
        }
	});
});