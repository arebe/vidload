//====================================================//
//==== Playlist: enter the file names here: ==========//

var allVideos = {
  "videos": [
  {"title": "video 1",
  "h264": "videos/01-16s_h264.mp4",
  "webm": "videos/01-16s_h264.webm",
  "ogg": "videos/01-16s_h264.ogv", 
  "doubleplay": "true",
},
{"title": "video 2",
"h264": "videos/02-18s_h264.mp4",
"webm": "videos/02-18s_h264.webm",  
"ogg": "videos/02-18s_h264.ogv",  
"doubleplay": "true",
},
{"title": "video 3",
"h264": "videos/03-13s_h264.mp4",
"webm": "videos/03-13s_h264.webm",
"ogg": "videos/03-13s_h264.ogv", 
"doubleplay": "true",
},
// {"title": "video 4",
// "h264": "videos/04-13s_h264.mp4",
// "webm": "videos/04-13s_h264.webm",
// "ogg": "videos/04-13s_h264.ogv", 
// "doubleplay": "true",
// },
// {"title": "video 5",
// "h264": "videos/05-22s_h264.mp4",
// "webm": "videos/05-22s_h264.webm",
// "ogg": "videos/05-22s_h264.ogv",
// "doubleplay": "true",
// },
// {"title": "video 6",
// "h264": "videos/magenta_test.mp4",
// "doubleplay": "true",
// },
// {"title": "video 7",
// "h264": "videos/magenta_test2.mp4",
// "doubleplay": "true",
// },
]
};



var randomOrder = true; // done - set to false if playlist order is non-random

//== Playing behavior 
var autoplayOn = false;  /// what is behavior of autoplay? this doesnt seem like a UI feature


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
// display index
var vindex = 0;

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

// initialize video player and its UI 
var vjsPlayer = function(w, h, i){
  // add videojs player to each video
  var options = {
    "width": w,
    "height": h,
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

  addVjs("video"+i, options);

  


  // theVideo = document.getElementById("video"+vindex);


  // if(vindex == i){
  //   theVideo.style.display="block";
  //   showVjs("video"+i);
  // }
  // else{
  //   theVideo.style.display="none";
  //   hideVjs("video"+i);
  // }

}; // end vjsplayer function

/// some globals -- refactor this ---//
// video element
  var theVideo;
// buttons - so they can access each other
var prevBtn, nextBtn;
// player state
var playing, speed, ffing, rwing, rwinterval;

function skipUI(){
  

  var theVideo = document.getElementById("video"+vindex);

  $("#video_player").append('<button type="button" class="btn_skip" id="btn_prev" disabled> &lt; &lt; </button>');
  $("#video_player").append('<button type="button" class="btn_skip" id="btn_next" > &gt; &gt; </button>');


  prevBtn = document.getElementById("btn_prev");
  nextBtn = document.getElementById("btn_next");

  // iterate through video playlist backwards
  prevBtn.addEventListener("click", function(){
    console.log("prev click, vindex: ", vindex);
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
  });
  // iterate through video playlist forwards
  nextBtn.addEventListener("click", function(){
    console.log("next click, vindex: ", vindex);
    if(vindex == vidElements.length-1 ){
      nextBtn.disabled = true;
    }
    else if(vindex == vidElements.length-2){
      hideVjs("video"+vindex);
      vindex++;
      showVjs("video"+vindex);
      prevBtn.disabled = false;
      nextBtn.disabled = true;
    }
    else{
      hideVjs("video"+vindex);
      vindex++;
      showVjs("video"+vindex);
      prevBtn.disabled = false;
    }

  });

}; // end skipUI function

function addVjs(vidElement, options){
  var thePlayer = videojs(vidElement, options, function(){
    console.log("initializing video js player for "+vidElement);
    this.addClass("vjs-big-play-centered");
  });
  if(rwOn){
      ///// TO BE DONE FULLY!!
      var rwBtn = thePlayer.controlBar.addChild('button',{
        text: "REWIND",

      });
      rwBtn.addClass("btn_rw");
    }
  }

  function showVjs(vidElement){
    theVideo = document.getElementById(vidElement+"_html5_api");
    theVideo.style.display="inline block";
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


// send the appropriate videos to the video loader
var preLoader = function(){
  var vidList = [];
  var vidType ;

  // check browser compatibilty and initiate fall-backs
  if (Modernizr.video.h264){ vidType = "video/mp4";}
  else if (Modernizr.video.webm){ vidType = "video/webm";}
  else if(Modernizr.video.ogg){ vidType = "video/ogg";}
  else { console.log("no html5 video support :( consider upgrading to a modern browser"); }

  // make a list of video files, basd on file type
  for (var i = 0; i < allVideos.videos.length; i++){
    switch(vidType){
      case "video/mp4":
      vidList.push(allVideos.videos[i].h264);
      break;
      case "video/webm":
      vidList.push(allVideos.videos[i].webm);
      break;      
      case "video/ogg":
      vidList.push(allVideos.videos[i].ogg);
      break;
      default:
      console.log("no html5 video support :( ");
    }
    
  }

  // randomize the videos, if necessary
  if (randomOrder){ shuffle(vidList); }

  // start loading the videos  
  for (var i = 0; i < vidList.length; i++) {
    // add form elements to track play count
    $('form[name="myForm"]').append('<input type="hidden" name="'+vidList[i]+'" value="0" />');
    // add video element for each video
    $("#videos").append('<video id="video'+i+'"  > Your browser does not support the video tag. </video>');
    // add progress bar
    $("#videos").append('<progress id="progress'+i+'" value="2" max="100"></progress>');
    if(i != 0 ){ $("#progress"+i).hide(); }
    // load the videos into their elements
    console.log("video " +i+ " filename: " + (vidList[i]));
    loadVid(vidList[i], vidType, i);
    
  }

  // player element w progress bar
  var videoPlayer = document.getElementById("video_player"); 
  videoPlayer.style.display="table";
  // UI controls
  // if(skipOn){ skipUI(); }
};

$(document).ready(preLoader());

// load the videos asynchronously while the user waits
// based on http://stackoverflow.com/questions/18251632/another-force-chrome-to-fully-buffer-mp4-video
function loadVid(vidFile, vidType, i){
	var elementID = "video"+i;
  var xhr = new XMLHttpRequest();
  xhr.onprogress = function(e){
    if(e.lengthComputable){
      var perctload = (e.loaded / e.total) *100;
      $("#progress"+i).val(perctload);
      console.log("computable - "+perctload, vidFile);
      if(perctload == 100){
        $("#progress"+i).hide();
      }
    }
    else {
      console.log("unable to compute progress for ",vidFile);
    }
  };
  xhr.open('GET', vidFile, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {

    if (this.status == 200) {
      var ltv = loadThisVid(this.response);      
    }
  };

  function loadThisVid(response){
    var myBlob = response;
    var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
      // myBlob is now the blob that the object URL pointed to.
      var video = document.getElementById(elementID);
      if (i != 0){ video.style.display="none"; }
      else{
        video.style.display="block";
        if(skipOn){ skipUI(); }
      }
      console.log("Loading video "+vidFile+" into element video"+i);
      console.log(elementID);
      console.log("video: ", video);
      video.src = vid;
      video.type=vidType ;
      video.controls=true;
      // update hidden form with play count
      $(video).on('play', function(){
        var v = parseInt($('input[name="'+vidFile+'"]').val());
        $('input[name="'+vidFile+'"]').val(++v);
      });
      vidElements.push(video);
      console.log("elementID: ", elementID)
      console.log("video width: "+video.videoWidth);
      video.addEventListener( "loadedmetadata", function (e) {
        var width = this.videoWidth,
        height = this.videoHeight;
        console.log("width listener: ", width);
        vjsPlayer(width, height, i);
      }, false );
    }


  xhr.send();

}
