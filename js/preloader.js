//====================================================//
//==== Playlist: enter the file names here: ==========//

var myVidsH264=[
   "videos/01-16s_h264.mp4", 
   "videos/02-18s_h264.mp4",	
   "videos/03-13s_h264.mp4",
   "videos/04-13s_h264.mp4",
   "videos/05-22s_h264.mp4",
   "videos/magenta_test.mp4",
   "videos/magenta_test2.mp4",
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

///TBD
var autoplayOn = false;  /// what is behavior of autoplay? this doesnt seem like a UI feature
var doubleplay = false; // play each video twice

//=== UI control toggles - set to false to remove from UI 
var playOn = true; // done
var ffOn = true;
var rwOn = true;
var skipOn = true; // done
var volumeOn =  true;
var durationOn = true;
var fullscOn = true;


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
var player = function(){
  // video elements
  var vindex = 0;
  var videoPlayer, theVideo;

  // buttons - so they can access each other
  var prevBtn, nextBtn, playBtn, ffBtn, rwBtn;

  // player state
  var playing, speed, ffing, rwing;

  videoPlayer = document.getElementById("video_player"); 
  theVideo = document.getElementById("video"+vindex);

  videoPlayer.style.display="table";
  theVideo.style.display="block";

  // UI controls
  if(playOn){ playUI(); }
  if(skipOn){ skipUI(); }
  if(ffOn){ ffUI(); }
  if(rwOn){ rwUI(); }


  function skipUI(){
      $("#video_player").append('<button type="button" class="btn_skip" id="btn_prev" disabled> &lt; &lt; </button>');
      $("#video_player").append('<button type="button" class="btn_skip" id="btn_next" > &gt; &gt; </button>');


      prevBtn = document.getElementById("btn_prev");
      nextBtn = document.getElementById("btn_next");

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
        // also change the play button state
        normalizeUI();
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
        // also change the play button state
        normalizeUI();
      })
    }


  function playUI(){
    $("#video_player").append('<input type="button" class="btn_skip" id="btn_play" value=" > "></input>');
    playBtn = document.getElementById("btn_play");
    playing = false;
    playBtn.addEventListener("click", function(){
      if(!playing){
        theVideo.play();
        playBtn.value=" || ";
        
      }
      else{
        theVideo.pause();
        playBtn.value=" > ";
      }
      playing = !playing;
    })
  }

  function ffUI(){
     $("#video_player").append('<input type="button" class="btn_ffrw" id="btn_ff" value=" >>| "></input>');
    ffBtn = $("#btn_ff");
    speed = 0;
    var ffing = false;
    ffBtn.click(function(){
      speed = !ffing ? 1.5 : 1;
      theVideo.playbackRate = speed;
      ffing = !ffing;
      console.log("speed: "+ speed);
    })
  }

  function rwUI(){
     $("#video_player").append('<input type="button" class="btn_ffrw" id="btn_rw" value=" |<< "></input>');
    rwBtn = $("#btn_rw");
    speed = 0;
    var rwing = false;
    rwBtn.click(function(){
      speed = !rwing ? (-10) : 1;
      theVideo.playbackRate = speed;
      rwing = !rwing;
      console.log("speed: "+ speed);
    })
  }

  function normalizeUI(){
    if(playOn){
      playBtn.value = " > ";
      playing = false;
    }
    if(ffOn || rwOn){
      speed = 1;
      ffing = false;
      rwing = false;
    }
  }

} // end player function



// send the appropriate videos to the video loader
var preLoader = function(){
  var vidList = [];
  var vidType ;

  // check browser compatibilty and initiate fall-backs
  if (Modernizr.video.h264){ vidList = myVidsH264; vidType = "video/mp4";}
  else if (Modernizr.video.webm){  vidList = myVidsWebm; vidType = "video/webm";}
  else if(Modernizr.video.ogg){ vidList = myVidsOgg; vidType = "video/ogg";}
  else { console.log("no html5 video support :( consider upgrading to a modern browser"); }

  // randomize the videos, if necessary
  if (randomOrder){ shuffle(vidList); }

  // start loading the videos  
  for (var i = 0; i < vidList.length; i++) {
    // add form elements to track play count
    $('form[name="myForm"]').append('<input type="hidden" name="'+vidList[i]+'" value="0" />');
    // add video element for each video
    $("#videos").append('<video id="video'+i+'"  > Your browser does not support the video tag. </video>');
    // load the videos into their elements
    console.log("video " +i+ " filename: " + (vidList[i]));
    loadVid(vidList[i], vidType, i);
    
  }

  // progress bar
  checkLoad();
}

$(document).ready(preLoader());

// load the videos asynchronously while the user waits
// based on http://stackoverflow.com/questions/18251632/another-force-chrome-to-fully-buffer-mp4-video
function loadVid(vidFile, vidType, i){
	var elementID = "video"+i;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', vidFile, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
    if (this.status == 200) {
    	var myBlob = this.response;
    	var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
        // myBlob is now the blob that the object URL pointed to.
        var video = document.getElementById(elementID);
        video.style.display="none";
        console.log("Loading video "+vidFile+" into element video"+i);
        video.src = vid;
        video.type=vidType;
        video.controls=true;
        // update hidden form with play count
        $(video).on('play', function(){
          var v = parseInt($('input[name="'+vidFile+'"]').val());
          $('input[name="'+vidFile+'"]').val(++v);
        })
        vidElements.push(video);
   }
  }
  xhr.send();

}



 





