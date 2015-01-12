// ajax from http://stackoverflow.com/questions/18251632/another-force-chrome-to-fully-buffer-mp4-video

console.log("Downloading videos...Please wait...")

var myVids=[
   "videos/01-16s_h264.mov", 
   "videos/02-18s_h264.mov",	
   "videos/03-13s_h264.mov",
   "videos/04-13s_h264.mov",
   "videos/05-22s_h264.mov",
]

var myVidsWebm=[
   "videos/01-16s_h264.webm", 
   "videos/02-18s_h264.webm",	
   "videos/03-13s_h264.webm",
   "videos/04-13s_h264.webm",
   "videos/05-22s_h264.webm",
]

var myVidsOgg=[
   "videos/01-16s_h264.ogv", 
   "videos/02-18s_h264.ogv",	
   "videos/03-13s_h264.ogv",
   "videos/04-13s_h264.ogv",
   "videos/05-22s_h264.ogv",
]

var vidElements = [];


console.log("modernizr video h264 support? " + Modernizr.video.h264);
console.log("modernizr video ogg support? " + Modernizr.video.ogg);
console.log("modernizr video webm support? " + Modernizr.video.webm);
var percentLoaded = 0;

function checkLoad(){ 
  var timeoutID = setInterval(function(){
    if(percentLoaded < 100){
      var bitsLoaded=0;
      var bitsTotal=0;
      for(var i =0; i < vidElements.length; i++){
        bitsLoaded+=vidElements[i].buffered.end(0);
        bitsTotal+=vidElements[i].duration;
        console.log("buffered: "+vidElements[1].buffered.end(0));
      }
      percentLoaded=parseInt(((bitsLoaded/bitsTotal)*100)); 
      $('progress').val(percentLoaded);
    }
    else{
      console.log("percentLoaded: "+percentLoaded);
      clearTimeout(timeoutID);
      $('progress').val(percentLoaded);
      document.getElementById("loading").style.display="none";
      player();
    }
  }, 200);}

var player = 
  function(){
    var videoPlayer = document.getElementById("video_player");
    var vindex = 0;
    var theVideo = document.getElementById("video"+vindex);

    videoPlayer.style.display="table";
    theVideo.style.display="block";

    var prevBtn = document.getElementById("btn_prev");
    var nextBtn = document.getElementById("btn_next");

    // iterate through video playlist backwards
    prevBtn.addEventListener("click", function(){
      if(vindex == 0){
        // go to begining of first video 
        prevBtn.disabled = true;
      }
      else{
        theVideo.style.display="none";
        vindex--;
        theVideo = document.getElementById("video"+vindex);
        theVideo.currentTime=0;
        theVideo.style.display="block";
        theVideo.pause();
        nextBtn.disabled = false;
      }
    })
    // iterate through video playlist forwards
    nextBtn.addEventListener("click", function(){
      if(vindex < (vidElements.length-1)){
        theVideo.style.display="none";
        vindex++;
        theVideo = document.getElementById("video"+vindex);
        theVideo.currentTime=0;
        theVideo.style.display="block";
        theVideo.pause();
        prevBtn.disabled = false;
      }
      else{
        // deactivate next button
        nextBtn.disabled = true;
      }
    })
  }


var preLoader = function(){
  for (var i = 0; i < myVids.length; i++) {
    if(Modernizr.video.h264){
    	console.log("video " +i+ " filename: " + (myVids[i]));
    	loadVid(myVids, "video/h264", i);

    }
    else if(Modernizr.video.webm){
    	console.log("video " +i+ " filename: " + (myVidsWebm[i]));
    	loadVid(myVidsWebm, "video/webm", i);
    }
    else if(Modernizr.video.ogg){
    	console.log("video " +i+ " filename: " + (myVidsOgg[i]));
    	loadVid(myVidsOgg, "video/ogg", i);
    }
    else{
    	console.log("no html5 video support :( consider upgrading to a modern browser");
    }
  }
  checkLoad();
}

preLoader();

function loadVid(vidArray, vidType, i){
	var elementID = "video"+i;
    console.log("element id: "+elementID);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', vidArray[i], true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
    if (this.status == 200) {
    	console.log("got it");
    	var myBlob = this.response;
    	var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
        // myBlob is now the blob that the object URL pointed to.
        var video = document.getElementById(elementID);
        video.style.display="none";
        console.log("Loading video "+i+" into element");
        video.src = vid;
        video.type=vidType;
        video.controls=true;
        vidElements.push(video);
   }
  }
  xhr.send();

}


 





