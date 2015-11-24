sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("zv.application.process.controller.ProcessDetails", {
		_objid: null,

		onInit: function() {
			this._initDetailsModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("processdetails").attachPatternMatched(this._onPatternMatched, this);
		},

		onPressLoadData: function() {
			this._loadProcessDetails();
		},

		onPressNavButton: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("processlist", true);
			}
		},

		_onPatternMatched: function(oEvent) {
			this._objid = oEvent.getParameter("arguments").objid;
			this._loadProcessDetails();
		},

		_initDetailsModel: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "ProcessDetailsData");
		},

		_loadProcessDetails: function() {
			//			this.getView().byId("idProcessList").setBusy(true);

			this.getOwnerComponent().getModel("oData").read("/ProcessSet('" + this._objid + "')", {
				"urlParameters": "$expand=ProcessAttributeSet,ProcessStepSet,ProcessStepCurrent/ProcessStepFeatureSet,ProcessStepCurrent/ProcessStepTransitionSet01,ProcessStepCurrent/ProcessStepTransitionSet02",
				"success": function(oData) {
					this.getView().getModel("ProcessDetailsData").setData(oData);
					//					this.getView().byId("idProcessList").setBusy(false);
				}.bind(this),
				"error": function(oError) {
					console.log(oError);
				}
			});
		}

	});
});