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
		}
		
		// --------------------------------------------------
		// OTHER
		// --------------------------------------------------
	};
});