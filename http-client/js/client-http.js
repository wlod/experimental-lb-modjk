/**
 * localhost - apache host 1234 - apache port
 */
const HOST_PORT = "http://localhost:1234";

const API_URL_GREETING = HOST_PORT + "/api/app/greeting";
const API_URL_DISABLE_API  = HOST_PORT + "/api/app/disableGreetingApi?durationTimeSetting=";


XMLHttpRequest.prototype.requestCookie = function requestCookie(requestCookie) {
	this.requestCookie = requestCookie;
}

XMLHttpRequest.prototype.reposneCookie = function reposneCookie(reposneCookie) {
	this.reposneCookie = reposneCookie;
}

var requestCounter = 1;

var HttpClient = function() {
	
	this.get = function(url, successCallback, errorCallback) {
		let httpRequest = this._createHttpRequest(successCallback, errorCallback);
		this._sendRequest(httpRequest, "GET", url);
	}
	this.put = function(url, successCallback, errorCallback) {
		let httpRequest = this._createHttpRequest(successCallback, errorCallback);
		this._sendRequest(httpRequest, "PUT", url);
	}
	
	this._sendRequest = function(httpRequest, method, url) {
		httpRequest.open(method, url, true);
		try {
			httpRequest.send();
		}
		catch(ex) {
			console.error(ex);
		}
	}
	
	this._createHttpRequest = function(successCallback, errorCallback) {
		let jsessionidValue = _cookieValue(COOKIE_NAME_JSESSIONID);
		let httpRequest = new XMLHttpRequest();
		httpRequest.requestCounter = requestCounter++;
		httpRequest.requestCookie(document.cookie);
		httpRequest.onreadystatechange = function() {
			if(httpRequest.readyState == 4) {
				if(httpRequest.status == 200) {
					successCallback(httpRequest, jsessionidValue);
					httpRequest.reposneCookie(document.cookie);
				}
				else {
					errorCallback(httpRequest, jsessionidValue);	
				}
			}
		}
		return httpRequest;
	}
}
