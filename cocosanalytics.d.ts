// Type definitions for ./jsb/jsb-cocosanalytics.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * Empty implementation for other platforms
 */
declare namespace cocosAnalytics{
		
	/**
	 * 
	 * @param info 
	 */
	function init(info : any): void;
		
	/**
	 * 
	 * @return  
	 */
	function isInited(): boolean;
		
	/**
	 * 
	 * @param enabled 
	 */
	function enableDebug(enabled : any): void;
	
	/**
	 * 
	 */
	namespace CAAccount{
				
		/**
		 * 
		 */
		function loginStart(): void;
				
		/**
		 * 
		 * @param info 
		 */
		function loginSuccess(info : any): void;
				
		/**
		 * 
		 */
		function loginFailed(): void;
				
		/**
		 * 
		 * @param info 
		 */
		function logout(info : any): void;
				
		/**
		 * 
		 * @param type 
		 */
		function setAccountType(type : any): void;
				
		/**
		 * 
		 * @param age 
		 */
		function setAge(age : any): void;
				
		/**
		 * 
		 * @param gender 
		 */
		function setGender(gender : any): void;
				
		/**
		 * 
		 * @param level 
		 */
		function setLevel(level : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function createRole(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CAEvent{
				
		/**
		 * 
		 * @param info 
		 */
		function onEvent(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function onEventStart(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function onEventEnd(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CAPayment{
				
		/**
		 * 
		 * @param info 
		 */
		function payBegin(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function paySuccess(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function payFailed(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function payCanceled(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CALevels{
				
		/**
		 * 
		 * @param info 
		 */
		function begin(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function complete(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function failed(info : any): void;
	}
	
	/**
	 * 
	 */
	var CATaskType : {
				
		/**
		 * 
		 */
		GuideLine : number;
				
		/**
		 * 
		 */
		MainLine : number;
				
		/**
		 * 
		 */
		BranchLine : number;
				
		/**
		 * 
		 */
		Daily : number;
				
		/**
		 * 
		 */
		Activity : number;
				
		/**
		 * 
		 */
		Other : number;
	}
	
	/**
	 * 
	 */
	namespace CATask{
				
		/**
		 * 
		 * @param info 
		 */
		function begin(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function complete(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function failed(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CAItem{
				
		/**
		 * 
		 * @param info 
		 */
		function buy(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function get(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function consume(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CAVirtual{
				
		/**
		 * 
		 * @param info 
		 */
		function setVirtualNum(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function get(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function consume(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CAAdvertising{
				
		/**
		 * 
		 * @param info 
		 */
		function begin(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function complete(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function failed(info : any): void;
	}
	
	/**
	 * 
	 */
	namespace CACustomEvent{
				
		/**
		 * 
		 * @param info 
		 */
		function onStarted(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function onSuccess(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function onCancelled(info : any): void;
				
		/**
		 * 
		 * @param info 
		 */
		function onFailed(info : any): void;
	}
}
