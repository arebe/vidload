// ajax from http://stackoverflow.com/questions/18251632/another-force-chrome-to-fully-buffer-mp4-video

console.log("Downloading videos...hellip;Please wait...")

var myVids=[
   "videos/01-16s_h264.mov", 
   "videos/02-18s_h264.mov",	
]

var myVidsWebm=[
   "videos/01-16s_h264.webm", 
   "videos/02-18s_h264.webm",	
]

var myVidsOgg=[
   "videos/01-16s_h264.ogv", 
   "videos/02-18s_h264.ogv",	
]

var vidElements = [];


console.log("modernizr video h264 support? " + Modernizr.video.h264);
console.log("modernizr video ogg support? " + Modernizr.video.ogg);
console.log("modernizr video webm support? " + Modernizr.video.webm);

var preLoader = function(e){
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
        console.log("Loading video "+i+" into element");
        video.src = vid;
        video.type=vidType;
        vidElements.push(video);
    // not needed if autoplay is set for the video element
    // video.play()
   }
  }
  xhr.send();

}

var percentLoaded = 0;


function checkLoad(){
  setInterval(function(){
    if(percentLoaded < 100){
      var bitsLoaded=0;
      var bitTotal=0;
      for(var i =0; i < vidElements.length; i++){
        vidElements[i].onprogress=function(){ bitsLoaded+=vidElements[i].buffered.end(0)};
        bitTotal+=vidElements[i].duration;
      }
      percentLoaded=parseInt(((bitsLoaded/bitTotal)*100));
      console.log("percentloaded: "+percentLoaded);
    }
    else{
      clearInterval();
    }
  }, 200);
}

