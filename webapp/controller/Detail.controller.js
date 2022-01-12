sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter",
	"sap/ui/Device",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History"
], function (Controller, FilterOperator, Filter, Device, Sorter, Fragment, History) {
	"use strict";

	return Controller.extend("com.airdit.Routing.controller.Detail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachMatched(this.Navigate.bind(this));
			this._mViewSettingsDialogs = {};

		},
		onSearch1: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue");
			var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
			this.getView().byId("MobileTable").getBinding("items").filter(oFilter);
		},

		Navigate: function (oEvent) {
			//Step 1: Read the value of variable which contains fruit id sent fron first view
			var sFruitId = oEvent.getParameter("arguments").Id;
			//Step 2: Build the path
			var sPath = "/fruits/" + sFruitId;
			//Step 3: Bind the element to set the data on V2
			this.getView().bindElement(sPath);
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("View2", {}, true);
			}
		},

		getViewSettingsDialog: function (sDialogFragmentName) {
			var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!pDialog) {
				pDialog = Fragment.load({
					id: this.getView().getId(),
					name: sDialogFragmentName,
					controller: this
				}).then(function (oDialog) {
					if (Device.system.desktop) {
						oDialog.addStyleClass("sapUiSizeCompact");
					}
					return oDialog;
				});
				this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
			}
			return pDialog;
		},

		handleSortButtonPressed: function () {
			this.getViewSettingsDialog("com.airdit.Routing.Fragments.SortDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
		},

		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("MobileTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		onConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oEvent.getSource().getId().indexOf("supplier") !== -1) {
				var supplierName = oSelectedItem.getTitle();
				var oFilter = new Filter("name", FilterOperator.EQ, supplierName);
				var oTable = this.getView().byId("MobileTable");
				oTable.getBinding("items").filter(oFilter);
			} else {
				var selectedCity = oSelectedItem.getLabel();
				this.fieldObject.setValue(selectedCity);
			}
		},

		Citypopup: null,
		SupplierPopup: null,
		fieldObject: null,

		onF4: function (oEvent) {
			this.fieldObject = oEvent.getSource();
			if (!this.Citypopup) {
				Fragment.load({
					id: "city",
					name: "com.airdit.Routing.Fragments.Popup",
					controller: this
				}).then(function (oDialog) {
					this.Citypopup = oDialog;
					this.Citypopup.bindAggregation("items", {
						path: '/cities',
						template: new sap.m.DisplayListItem({
							label: "{name}",
							value: "{state}"
						})

					});
					this.Citypopup.setTitle("Cities");
					this.getView().addDependent(this.Citypopup);
					this.Citypopup.open();
				}.bind(this));

			} else {
				this.Citypopup.open();
			}

		},

		onFilter: function () {
			if (!this.SupplierPopup) {
				Fragment.load({
					id: "supplier",
					name: "com.airdit.Routing.Fragments.Popup",
					controller: this
				}).then(function (oDialog) {
					this.SupplierPopup = oDialog;
					this.SupplierPopup.bindAggregation("items", {
						path: "/supplier",
						template: new sap.m.StandardListItem({
							icon: "sap-icon://supplier",
							description: "Since {sinceWhen} in {city}",
							title: "{name}"
						})

					});
					this.getView().addDependent(this.SupplierPopup);
					this.SupplierPopup.open();
				}.bind(this));
			} else {
				this.SupplierPopup.open();
			}
		}

	});
});