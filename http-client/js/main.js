var viewClient = new ViewClient();
var client = new HttpClient(viewClient);


window.onload = function() {
	
	viewClient.updateStaticValues();
	viewClient.updateCurrentStatus();
	
}

/**
 * 
 * /api/app/greeting - API provided by GreetingController
 * 
 */
function sendAppGreetingRequest() {
	client.get(API_URL_GREETING,
		function(httpRequest, jsessionidValue) {
			viewClient.updateCurrentStatus();
			viewClient.currentWorkerStatusOnline();
			viewClient.printLog(httpRequest, jsessionidValue);
		},
		function(httpRequestError, jsessionidValue) {
			viewClient.printLog(httpRequestError, jsessionidValue);
		}
	);
}

/**
 * 
 * /api/app/disableGreetingApi - API provided by GreetingController
 * 
 */
function sendAppDisableGreetingApiRequest(durationTimeSettingEleId) {
	let durationTimeSetting = 60;
	
	let durationTimeSettingInput = _byId(durationTimeSettingEleId);
	
	if(isNotEmpty(durationTimeSettingInput.value)) {
		durationTimeSetting = durationTimeSettingInput.value;
	}
	
	client.put(API_URL_DISABLE_API + durationTimeSetting,
		function(httpRequest, jsessionidValue) {
			viewClient.updateCurrentStatus();
			viewClient.updateWorkerStatus(durationTimeSetting);
			viewClient.printLog(httpRequest, jsessionidValue, jsessionidValue);
		},
		function(httpRequestError, jsessionidValue) {
			viewClient.printLog(httpRequestError, jsessionidValue);
		}
	);
}