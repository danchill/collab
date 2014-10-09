var recipientDomains = {
	"root":"https://securegh.toyota.com/",
	"exterior":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"interior":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"webglexterior":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"webglinterior":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"webglhyperlapse":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"scenes":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"ajaxserver":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/",
	"default":"https://qjvn6a1pq7qfe6thoat7fkth1n3b8ggt-a-hangout-opensocial.googleusercontent.com/"
}

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
var lastMessage = "";


eventer(messageEvent,function(e) {
  	//console.log(e.origin+": "+e.data);
  		
  	_msgObj = JSON.parse(e.data);
  	
	if(_msgObj.recipient in recipientDomains || _msgObj.from in recipientDomains){
  		
  		daemonReceiver(_msgObj.recipient,_msgObj.from,_msgObj.message,e);
  		
  	}
},false);


var daemon = {
	
	send:function(_info){
		if(_info.recipient == "root"){
			this.send_up(_info);
		}else{
			this.send_down(_info);
		}
	},
	send_down:function(_message){
		
		var _recipientFrame = _message.targetFrame;
		_message = JSON.stringify(_message);
		document.getElementById(_recipientFrame).contentWindow.postMessage(_message,recipientDomains["root"]);
		
	},
	send_up:function(_message){
	
		var _recipientName = _message.from;
		var _recipDomain = !recipientDomains[_recipientName] ? recipientDomains["default"] : recipientDomains[_recipientName];
		_message = JSON.stringify(_message);
		parent.postMessage(_message,_recipDomain);
		
	}
}


function daemonReceiver(_recipient,_sender,_msg,_event){
	if(_recipient == DAEMON_RECEIVER_ID){
	    if(_msg != lastMessage && _msg.indexOf("updatePreloader") < 0 && _msg.indexOf("Cursors.send") < 0  && _msg.indexOf("Pano.rotate") < 0){
	    	//console.log(_sender+" sent message to "+_recipient+": "+_msg);
	    	lastMessage = _msg;
	    }
	    if(_msg.indexOf("FN:") >= 0){
	    	if(_msg.indexOf("Preloader") > -1 && _recipient == "root"){
	    		if(_recipient == "root" && $("#"+_sender+"-view").is(":visible")){
	    			eval(_msg.split("FN:")[1]);
	    		}
	    	}else{
		    	eval(_msg.split("FN:")[1]);
	    	}
	    }
	}
}
