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

var randomOrder = true; // done - set to false if playlist order is non-random

///TBD
var autoplayOn = false;  /// what is behavior of autoplay? this doesnt seem like a UI feature
var doubleplay = false; // play each video twice

//=== UI control toggles - set to false to remove from UI 
var playOn = true;
var ffOn = true; // uhh
var rwOn = true; // wat
var skipOn = true; 
var volumeOn =  true;
var muteOn = true;
var durationOn = true;
var seekOn = true;
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

// check the file sizes n the server 
function checkSizes(files){
  var fileBytes;
  // from: http://stackoverflow.com/questions/17416274/ajax-get-size-of-file-before-downloading
  for (var i = 0; i < files.length; i++){
    get_filesize(files[i], function(filesize){
      console.log("file of size: "+filesize);
      fileBytes += filesize;
    });
    
  }
  console.log("total fileBytes: "+fileBytes);

  function get_filesize(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
                                 //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            callback(parseInt(xhr.getResponseHeader("Content-Length")));
        }
    };
    xhr.send();

    // return fileBytes;
  }

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
  // add videojs player to each video
  for (var i = 0; i < vidElements.length; i++){
    var options = {
      "width": $("#video"+i).prop('videoWidth'),
      "height": $("#video"+i).prop('videoHeight'),
      controlBar: {
        playToggle: (playOn ? true : false),
        fullscreenToggle: (fullscOn ? true : false),
        currentTimeDisplay: (durationOn ? true : false),
        durationDisplay: (durationOn ? true : false),
        remainingTimeDisplay: (durationOn ? true : false),
        timeDivider: (durationOn ? true : false),
        progressControl: {
          seekBar: (seekOn ? true : false),
        },
        volumeControl: (volumeOn ? true : false),
        muteToggle: (muteOn ? true : false),
      },
    };
    // add options for controls based on toggled options or whatever

    addVjs("video"+i, options);
  }

  // video elements
  var vindex = 0;
  var videoPlayer, theVideo;

  // buttons - so they can access each other
  var prevBtn, nextBtn, playBtn, ffBtn, rwBtn;

  // player state
  var playing, speed, ffing, rwing, rwinterval;

  videoPlayer = document.getElementById("video_player"); 
  theVideo = document.getElementById("video"+vindex);

  videoPlayer.style.display="table";
  theVideo.style.display="block";
  showVjs("video"+vindex);

  // UI controls
  // if(playOn){ playUI(); }
  if(skipOn){ skipUI(); }
  // if(rwOn){ rwUI(-0.1); }
  // if(ffOn){ ffUI(); }
  // if(volumeOn){ volUI(); }



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
          hideVjs("video"+vindex);
          vindex--;
          showVjs("video"+vindex);
          prevBtn.disabled = true;
        }
        else{
          hideVjs("video"+vindex);        
          vindex--;
          showVjs("video"+vindex);
          nextBtn.disabled = false;
        }
      })
      // iterate through video playlist forwards
      nextBtn.addEventListener("click", function(){
        if(vindex == vidElements.length-1){
          nextBtn.disabled = true;
        }
        else if(vindex == vidElements.length-2){
          hideVjs("video"+vindex);
          vindex++;
          showVjs("video"+vindex);
          // theVideo.pause();
          prevBtn.disabled = false;
          nextBtn.disabled = true;
        }
        else{
          hideVjs("video"+vindex);
          vindex++;
          showVjs("video"+vindex);
          prevBtn.disabled = false;
        }

      })
    }

  function addVjs(vidElement, options){
    theVideo = document.getElementById(vidElement);
    videojs(vidElement, options, function(){
      console.log("initializing video js player for "+vidElement);
    })
  }

  function showVjs(vidElement){
    theVideo = document.getElementById(vidElement+"_html5_api");
    theVideo.style.display="block";
    theVjs = document.getElementById(vidElement);
    theVjs.style.display="block";
    $("#"+vidElement).addClass("video-js vjs-default-skin");
    console.log("showing video js player for "+vidElement);
  }

  function hideVjs(vidElement){
    var oldVideo = document.getElementById(vidElement);
    // reset to beginning 
    videojs(oldVideo).pause();
    videojs(oldVideo).currentTime(0);
    oldVideo.style.display="none";
    $("#"+vidElement).removeClass("video-js vjs-default-skin");
    console.log("player hidden for "+vidElement);
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

  // check file sizes for progress bar
  checkSizes(vidList);

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
      video.type=vidType ;
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



 





