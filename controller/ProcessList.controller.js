sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("zv.application.process.controller.ProcessList", {
		
		onInit: function() {
			this._initListModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("processlist").attachPatternMatched(this._loadProcessList, this);
		},
		
		onPressLoadData: function(){
			this._loadProcessList();
		},
		
		onPressListItem: function(oEvent){
			var oItem = oEvent.getSource();
			var oItemData = this.getView().getModel("ProcessListData").getProperty(oItem.getBindingContext("ProcessListData").getPath());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("processdetails", {
				objid: oItemData.Objid
			});
		},

		_initListModel: function(){
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "ProcessListData");
		},
		
		_loadProcessList: function(){
			this.getView().byId("idProcessList").setBusy(true);
			
			this.getOwnerComponent().getModel("oData").read("/ProcessSet",{
				"urlParameters": "$expand=ProcessStepCurrent",
				"success": function(oData){
					this.getView().getModel("ProcessListData").setProperty("/List", oData.results);
					this.getView().byId("idProcessList").setBusy(false);
				}.bind(this),
				"error": function(oError){
					console.log(oError);
				}
			});
		}
		
	});
});