sap.ui.define([], function () {
	"use strict";
		
	return {
		// --------------------------------------------------
		// PROCESS FEATURES
		// --------------------------------------------------
		isVisibleProcessForward: function (oDataProcess) {
			if(!oDataProcess){
				return false;
			}else{
				return this._isProcessFeatureActive("PROCESS_FORWARD", oDataProcess.ProcessFeatureSet);	
			}
		},
		
		isVisibleProcessCancel: function (oDataProcess) {
			if(!oDataProcess){
				return false;
			}else{
				return this._isProcessFeatureActive("PROCESS_CANCEL", oDataProcess.ProcessFeatureSet);
			}
		},
		
		// --------------------------------------------------
		// STEP FEATURES
		// --------------------------------------------------
		isVisibleStepConfirm: function (oDataStep) {
			if(!oDataStep){
				return false;
			}else{
				if(oDataStep.ProcessStepTransitionSet01.results.length === 0){
					return false;
				}else{
					return true;
				}
				//return this._isStepFeatureActive("TRANSITION_CONFIRM", oDataStep.ProcessStepFeatureSet);
			}
		},
		
		isVisibleStepBack: function (oDataStep) {
			if(!oDataStep){
				return false;
			}else{
				if(oDataStep.ProcessStepTransitionSet02.results.length === 0){
					return false;
				}else{
					return true;
				}
				//return this._isStepFeatureActive("TRANSITION_BACK", oDataStep.ProcessStepFeatureSet);
			}
		},
		
		// --------------------------------------------------
		// OTHER
		// --------------------------------------------------
		getSMObjViewValue: function(oData){
			//return this.convertSMValueText(oData.Value, oData.Type);
			
			var sValue = "";
			
			if(oData.Type === "DT"){
				if(oData.Value === "00000000"){
					sValue = "";
				}else{
					jQuery.sap.require("sap.ui.core.format.DateFormat");  
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({UTC: true});
					sValue = oDateFormat.format(new Date(Date.UTC(oData.Value.slice(0, 4), oData.Value.slice(4, 6) - 1, oData.Value.slice(6, 8))));
				}
			}else if(oData.Type === "CB"){
				if(oData.Value === "X"){
					sValue = "yes";
				}else{
					sValue = "no";
				}
			}else{
				sValue = oData.Value;
			}

			return sValue;
		},
		
		getSMObjViewValueOld: function(oData){
			//return this.convertSMValueText(oData.ValueOld, oData.Type);
			
			var sValue = "";
			
			if(oData.Type === "DT"){
				if(oData.ValueOld === "00000000"){
					sValue = "";
				}else{
					jQuery.sap.require("sap.ui.core.format.DateFormat");  
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({UTC: true});
					sValue = oDateFormat.format(new Date(Date.UTC(oData.ValueOld.slice(0, 4), oData.ValueOld.slice(4, 6) - 1, oData.ValueOld.slice(6, 8))));
				}
			}else if(oData.Type === "CB"){
				if(oData.ValueOld === "X"){
					sValue = "yes";
				}else{
					sValue = "no";
				}
			}else{
				sValue = oData.ValueOld;
			}

			return sValue;
		},
		
		convertSMValueText: function(sValue, sType){
			return "";
		}
	};
});