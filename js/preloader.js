console.log("Downloading videos...Please wait...")

//====================================================//
//==== Playlist: enter the file names here: ==========//

var myVidsH264=[
   "videos/01-16s_h264.mp4", 
   "videos/02-18s_h264.mp4",	
   "videos/03-13s_h264.mp4",
   "videos/04-13s_h264.mp4",
   "videos/05-22s_h264.mp4",
]

// var myVidsH264=[
//    "videos/01-16s_h264.mov", 
//    "videos/02-18s_h264.mov",  
//    "videos/03-13s_h264.mov",
//    "videos/04-13s_h264.mov",
//    "videos/05-22s_h264.mov",
// ]

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

var randomOrder = true; // set to false if playlist order is non-random

//====================================================//
//===================================================//

// html5 video elements
var vidElements = [];

console.log("modernizr video h264 support? " + Modernizr.video.h264);
console.log("modernizr video webm support? " + Modernizr.video.webm);
console.log("modernizr video ogg support? " + Modernizr.video.ogg);

// this function will randomly shuffle the list of videos upon page load
// from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// check the video loading progress and update the progress bar
function checkLoad(){ 
  var percentLoaded = 0;
  var timeoutID = setInterval(function(){
    console.log("videlements.length: "+vidElements.length);
    console.log("myVidsH264.length: "+myVidsH264.length);
    if(percentLoaded < 100){
      percentLoaded = (vidElements.length+1) / (myVidsH264.length+1) * 100;
      $('progress').val(percentLoaded);
    }
    else{
      console.log("percentLoaded: "+percentLoaded);
      clearTimeout(timeoutID);
      $('progress').val(percentLoaded);
      document.getElementById("loading").style.display="none";
      player();
    }
  }, 400);}

// initialize video player and its UI 
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
        prevBtn.disabled = true;
      }
      else if (vindex == 1) {
        theVideo.style.display="none";
        vindex--;
        theVideo = document.getElementById("video"+vindex);
        theVideo.currentTime=0;
        theVideo.style.display="block";
        theVideo.pause();
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
      if(vindex == vidElements.length-1){
        nextBtn.disabled = true;
      }
      else if(vindex == vidElements.length-2){
        theVideo.style.display="none";
        vindex++;
        theVideo = document.getElementById("video"+vindex);
        theVideo.currentTime=0;
        theVideo.style.display="block";
        theVideo.pause();
        prevBtn.disabled = false;
        nextBtn.disabled = true;
      }
      else{
        theVideo.style.display="none";
        vindex++;
        theVideo = document.getElementById("video"+vindex);
        theVideo.currentTime=0;
        theVideo.style.display="block";
        theVideo.pause();
        prevBtn.disabled = false;
      }
    })
  }


// send the correct videos to the video loader
var preLoader = function(){
  var vidList = [];

  // check browser compatibilty and initiate fall-backs
  // if (Modernizr.video.webm){  vidList = myVidsWebm; }
  // else if (Modernizr.video.h264){ vidList = myVidsH264; }
  // else if(Modernizr.video.ogg){ vidList = myVidsOgg; }
  // else { console.log("no html5 video support :( consider upgrading to a modern browser"); }

  if (Modernizr.video.h264){ vidList = myVidsH264; }
  else if (Modernizr.video.webm){  vidList = myVidsWebm; }
  else if(Modernizr.video.ogg){ vidList = myVidsOgg; }
  else { console.log("no html5 video support :( consider upgrading to a modern browser"); }

  // randomize the videos, if necessary
  if (randomOrder){ shuffle(vidList); }

  // start loading the videos  
  for (var i = 0; i < vidList.length; i++) {
    console.log("video " +i+ " filename: " + (vidList[i]));
    loadVid(myVidsWebm, "video/webm", i);
  }

  // progress bar
  checkLoad();
}

preLoader();

// load the videos asynchronously while the user waits
// based on http://stackoverflow.com/questions/18251632/another-force-chrome-to-fully-buffer-mp4-video
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


 





