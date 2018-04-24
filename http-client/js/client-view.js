const CONF_APACHE_HOSTNAME = "conf.apache.hostname";
const CONF_APACHE_PORT = "conf.apache.port";

const STATUS_SESSIONID = "status.sessionid";
const STATUS_STICKY_SESSION_WORKER = "status.sticky-session-worker";
const STATUS_STICKY_SESSION_WORKER_AJP = "status.sticky-session-worker.ajp";

const LOG_REQUEST_RESPONSE_CONTAINER = "logs.request-response.container";

const COOKIE_NAME_JSESSIONID = "JSESSIONID"

const WORKER_INFO_1 = "worker-info-1";
const WORKER_INFO_2 = "worker-info-2";

const WORKER_HTML_MAP =  {"1": WORKER_INFO_1, "2": WORKER_INFO_2 };

var url = window.location.host;
var hostname = window.location.hostname;
var port = window.location.port;

var currentJsessionidValue = "none";
var currentWorker = "none";
var currentWorkerAjpPort = "none";

var ViewClient = function() {
	
	this.updateStaticValues = function() {
		_byId(CONF_APACHE_HOSTNAME).innerHTML=hostname;
		_byId(CONF_APACHE_PORT).innerHTML=port;
	}
	
	this.updateCurrentStatus = function() {
		let jsessionidValue = _cookieValue(COOKIE_NAME_JSESSIONID);
		if(isNotEmpty(jsessionidValue)) {
			currentJsessionidValue = jsessionidValue;
			let jsessionidValueAsArray= jsessionidValue.split(".");
			
			if(jsessionidValueAsArray.length >= 2) {
				currentWorkerAjpPort = jsessionidValueAsArray[0].split("_")[2];
				currentWorker = jsessionidValueAsArray[1].replace("app-worker", "");
			}
		}
		
		_byId(STATUS_SESSIONID).innerHTML=currentJsessionidValue;
		_byId(STATUS_STICKY_SESSION_WORKER).innerHTML=currentWorker;
		_byId(STATUS_STICKY_SESSION_WORKER_AJP).innerHTML=currentWorkerAjpPort;
	}

	this.updateWorkerStatus = function(durationTimeSetting) {
		let seconds = durationTimeSetting;
		let workerHtmlEle = _byId( WORKER_HTML_MAP[currentWorker] );
		
		workerHtmlEle.className = "offline";
		workerHtmlEle.innerHTML="greeting api disabled ("+seconds+"s/"+durationTimeSetting+"s)";
		
		setInterval(function() {
			seconds--;
		    if (seconds >= 0) {
		    	workerHtmlEle.innerHTML="greeting api disabled ("+seconds+"s/"+durationTimeSetting+"s)";
		    }
		    if (seconds === 0) {
		    	workerHtmlEle.innerHTML = "online";
		    	workerHtmlEle.className = "online";
		    	clearInterval(seconds);
		    }
		  }, 1000);
		
	}
	
	this.currentWorkerStatusOnline = function() {
		this._updateCurrentWorkerStatus("online");
	}
	
	this.currentWorkerStatusOffline = function() {
		this._updateCurrentWorkerStatus("offline");
	}
	
	this._updateCurrentWorkerStatus = function(status) {
		let workerHtmlEle = _byId( WORKER_HTML_MAP[currentWorker] );
	    workerHtmlEle.innerHTML = status;
	    workerHtmlEle.className = status;
	}
	
	
	this.printLog = function(httpRequest, sessionId) {
		console.log("sessionId " + sessionId);
		console.debug(httpRequest);
		
		this.httpRequest = httpRequest;
		this.sessionId = sessionId;
		
		this.currentSessionId = _cookieValue(COOKIE_NAME_JSESSIONID);
		
		this.changedSessionStyle = "";
		if(this.sessionId !== this.currentSessionId) {
			this.changedSessionStyle = "worker-changed";
		}
		
		// only for POC
		this.responseFrom = httpRequest.responseText.indexOf('Service Unavailable') >= 0 ? "Apache" : "Worker"; 
		
		const logContainer = `
	    	<ul class="req-resp-container">
	    	<li class="counter"><span>${this.httpRequest.requestCounter}</span></li>
	        <li>
	            <strong>REQUEST</strong><br/>
	            <span>URL:</span> <span class="status-value">${this.httpRequest.responseURL}</span><br/>
	            <span>Sessionid:</span> <span class="status-value">${this.sessionId}</span>
	        </li>
	        <li>
	            <strong>RESPSONE:</strong><br/>
	            <span>Status:</span> <span class="status-value">${this.httpRequest.status}</span> - <span>${httpRequest.statusText}</span><br/>
	            <span>From:</span> <span class="status-value">${this.responseFrom}</span><br/>
	            <span>Sessionid:</span> <span class="status-value ${this.changedSessionStyle}">${this.currentSessionId}</span>
	        </li>
	    	</ul>`;
		
		const logsContainer = _byId(LOG_REQUEST_RESPONSE_CONTAINER);
		let currentLogsContainer = logsContainer.innerHTML; 
		logsContainer.innerHTML = logContainer + currentLogsContainer;
		
	}
	
}