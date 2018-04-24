function _byId(elementId) {
	return document.getElementById(elementId);
}

function _cookieValue(cookieName) {
	let cookieValue = document.cookie.match(cookieName + '=([^;]*)');
	if(isNotEmpty(cookieValue)) {
		return cookieValue[1];
	}
	return null;
}

function isNotEmpty(str) {
	return !isEmpty(str);
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}