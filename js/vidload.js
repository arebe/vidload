	// load page - depends on jquery
$(document).ready(function(){
	console.log('ready!');
	// canvas stuff - not necessary yet
//	$('#canvas').addClass('wheel_background');
//	canvas = document.getElementById('canvas'),
//	context = canvas.getContext('2d');
	// test loading image

});

function eventWindowLoaded(){
	var videoElement = document.getElementById("thevideo");

	videoElement.addEventListener('progress', updateLoadingStatus, false);
	videoElement.addEventListener('canplaythrough', playVideo, false);
}

function updateLoadingStatus(){
	var loadingStatus = document.getElementById("loadingStatus");
	var videoElement = document.getElementById("thevideo");
	var percentLoaded = parseInt(((videoElement.buffered.end(0) / videoElement.duration) * 100));
	document.getElementById("loadingStatus").innerHTML = percentLoaded +'%';
	console.log("percent loaded: " + percentLoaded);
}

function playVideo(){
	var videoElement = document.getElementById("thevideo");
	videoElement.play();
}