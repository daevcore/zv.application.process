sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"zv/application/process/model/formatter",
	'sap/m/MessageToast',
	'sap/m/MessageBox'
	
], function(Controller, History, formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("zv.application.process.controller.ProcessDetails", {
		formatter: formatter,
		_actionSheetSettings: null,
		_actionSheetTransitions: null,
		_dialogTransitionComment: null,
		_objid: null,
		
		_messageError: function(oData){
			console.log(oData);
			
			var oErrorBody = JSON.parse(oData.responseText);
			//MessageToast.show(oErrorBody.error.message.value);
			MessageBox.show(oErrorBody.error.message.value, sap.m.MessageBox.Icon.ERROR, "ERROR");
		},
		
		onInit: function() {
			this._initDetailsModel();
			this._initActionSheetSettings();
			this._initActionSheetTransitions();
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("processdetails").attachPatternMatched(this._onPatternMatched, this);
		},

		onPressLoadData: function() {
			this._loadProcessDetails();
		},

		onPressNavButton: function() {
			this._navToList();
		},
		
		_navToList: function(){
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("processlist", true);
			}
		},
		
		onPressSettings: function(oEvent){
			this._actionSheetSettings.openBy(oEvent.getSource());
		},
		
		onPressProcessForward: function(){
			this._doAction("PROCESS_FORWARD", "");
		},
		
		onPressProcessCancel: function(){
			this._doAction("PROCESS_CANCEL", "");
		},
		
		onPressProcessStepNext: function(oEvent) {
			var transitionSet = this.getView().getModel("ProcessDetailsData").getProperty("/ProcessStepCurrent/ProcessStepTransitionSet01");
			if(transitionSet.results.length === 1){
				this._processStepTransition(transitionSet.results[0]);
			}else if(transitionSet.results.length > 1){
				this._actionSheetTransitions.getModel("TransitionSet").setData(transitionSet);
				this._actionSheetTransitions.openBy(oEvent.getSource());
			}
		},
		onPressProcessStepBack: function(oEvent) {
			var transitionSet = this.getView().getModel("ProcessDetailsData").getProperty("/ProcessStepCurrent/ProcessStepTransitionSet02");
			if(transitionSet.results.length === 1){
				this._processStepTransition(transitionSet.results[0]);
			}else if(transitionSet.results.length > 1){
				this._actionSheetTransitions.getModel("TransitionSet").setData(transitionSet);
				this._actionSheetTransitions.openBy(oEvent.getSource());
			}
		},
		onPressProcessStepTransition: function(oEvent){
			var oTransition = oEvent.getSource().getModel("TransitionSet").getProperty(oEvent.getSource().getBindingContext("TransitionSet").getPath());
			this._processStepTransition(oTransition);
		},
		
		onDialogTransitionCommentLiveChange: function(oEvent){
			var sText = oEvent.getParameter('value');
			var oParent = oEvent.getSource().getParent();
			oParent.getBeginButton().setEnabled(sText.length > 0);
		},
		
		onDialogTransitionCommentConfirm: function(){
			var oTransition = this._dialogTransitionComment.getModel("TransitionComment").getProperty("/Transition");
			var sComment = this._dialogTransitionComment.getModel("TransitionComment").getProperty("/Comment");
			this._doTransition(oTransition, sComment);
			this._dialogTransitionComment.close();
		},
		
		onDialogTransitionCommentCancel: function(oEvent){
			this._dialogTransitionComment.close();
		},
		
		_processStepTransition: function(oTransition){
			if(oTransition.CommentRequired === true){
				this._openDialogTransitionComment(oTransition);
			}else{
				this._doTransition(oTransition, "");
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
		
		_initActionSheetSettings: function(){
			this._actionSheetSettings = sap.ui.xmlfragment("zv.application.process.view.processdetails.ActionSheetSettings", this);
			this.getView().addDependent(this._actionSheetSettings);
		},
		
		_initActionSheetTransitions: function(){
			var oModel = new sap.ui.model.json.JSONModel();
			this._actionSheetTransitions = sap.ui.xmlfragment("zv.application.process.view.processdetails.ActionSheetTransitions", this);
			this._actionSheetTransitions.setModel(oModel, "TransitionSet");
			this.getView().addDependent(this._actionSheetTransitions);
		},
		
		_openDialogTransitionComment: function(oTransition){
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setProperty("/Transition", oTransition);
			oModel.setProperty("/Comment", "");
			
			this._dialogTransitionComment = sap.ui.xmlfragment("zv.application.process.view.processdetails.DialogTransitionComment", this);
			this._dialogTransitionComment.setModel(oModel, "TransitionComment");
			this.getView().addDependent(this._dialogTransitionComment);
			
			this._dialogTransitionComment.open();
		},
		
		_doTransition: function(oTransition, sComment){
			this.getOwnerComponent().getModel("oData").callFunction("/doTransition", {
				"method": "POST",
				"urlParameters":{
					Objid: oTransition.Objid,
					Step: oTransition.Step,
					StepTarget: oTransition.StepTarget,
					Comment: sComment
				},
				"success": function(oData) {
					this._loadProcessDetails();
				}.bind(this),
				"error": function(oError) {
					this._messageError(oError);
				}.bind(this)
			});
			
		},
		
		_doAction: function(sActionId, sActionParameter){
			this.getOwnerComponent().getModel("oData").callFunction("/doAction", {
				"method": "GET",
				"urlParameters": {
					Objid: this._objid,
					ActionId: sActionId,
					ActionParameter: sActionParameter
				},
				"success": function(oData) {
					console.log(oData);
				}.bind(this),
				"error": function(oError) {
					this._messageError(oError);
				}.bind(this)
			});
		},
		
		_doActionStep: function(sStep, sActionId, sActionParameter){
			this.getOwnerComponent().getModel("oData").callFunction("/doActionStep", {
				"method": "GET",
				"urlParameters": {
					Objid: this._objid,
					Step: sStep,
					ActionId: sActionId,
					ActionParameter: sActionParameter
				},
				"success": function(oData) {
					console.log(oData);
				}.bind(this),
				"error": function(oError) {
					this._messageError(oError);
				}.bind(this)
			});
		},
		
		_loadProcessDetails: function() {
			this.getView().byId("idPageProcessDetails").setBusy(true);

			this.getOwnerComponent().getModel("oData").read("/ProcessSet('" + this._objid + "')", {
				"urlParameters": "$expand=ProcessFeatureSet,ProcessAttributeSet,ProcessStepSet,ProcessStepCurrent,ProcessStepCurrent/ProcessStepFeatureSet,ProcessStepCurrent/ProcessStepTransitionSet01,ProcessStepCurrent/ProcessStepTransitionSet02",
				"success": function(oData) {
					this.getView().getModel("ProcessDetailsData").setData(oData);
					this.getView().byId("idPageProcessDetails").setBusy(false);
					
					this._loadProcessStepData();
					
					if(oData.ProcessStepCurrent.IsCompatibleUI5 === false){
						sap.m.MessageBox.show("This step is not compatible with UI5!", {
						    icon: sap.m.MessageBox.Icon.ERROR,
						    title: "ERROR",
						    onClose: function() {
						    	this._navToList();
						    }.bind(this)
						});
					}else{
						// ...
					}
				}.bind(this),
				"error": function(oError) {
					this._messageError(oError);
				}.bind(this)
			});
		},
		
		_loadProcessStepData: function(){
			var sStepType = this.getView().getModel("ProcessDetailsData").getProperty("/ProcessStepCurrent/Type");
			if(sStepType === 'SIMPLE_MODE_EDIT'){
				this._loadProcessStepDataSMObjEdit();
			}else{
				this.getView().byId("idProcessStepContent").destroyContent();
			}
		},
		
		_loadProcessStepDataSMObjEdit: function(){
			var sObjid = this.getView().getModel("ProcessDetailsData").getProperty("/ProcessStepCurrent/Objid");
			var sStep = this.getView().getModel("ProcessDetailsData").getProperty("/ProcessStepCurrent/Step");

			this.getOwnerComponent().getModel("oData").read("/ProcessStepDataSMObjAttrSet", {
				"filters": [
					new sap.ui.model.Filter({
						path: "Objid",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sObjid
					}),
					new sap.ui.model.Filter({
						path: "Step",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sStep
					})
				],
				"success": function(oData) {
					console.log(oData);
					
					var oView = new sap.ui.xmlview("zv.application.process.view.processdetails.stepdata.SMObjEdit");
					oView.setModel(new sap.ui.model.json.JSONModel(oData), "ProcessStepData");
					this.getView().byId("idProcessStepContent").destroyContent();
					this.getView().byId("idProcessStepContent").addContent(oView);
				}.bind(this),
				"error": function(oError) {
					this._messageError(oError);
				}.bind(this)
			});
		},
		
		_isProcessFeatureActive: function (sFeature, oFeatureSet) {
			var bVisible = false;
			if(oFeatureSet){
				for (var index in oFeatureSet.results) {
					if(oFeatureSet.results[index].Feature === sFeature){
						bVisible = true;
					}
				}
			}
			return bVisible;
		},
		
		_isStepFeatureActive: function (sFeature, oFeatureSet) {
			var bVisible = false;
			for (var index in oFeatureSet.results) {
				if(oFeatureSet.results[index].Feature === sFeature){
					bVisible = true;
				}
			}
			
			if(sFeature === "TRANSITION_CONFIRM"){
				bVisible = true;
			}
			
			return bVisible;
		}
	});
});