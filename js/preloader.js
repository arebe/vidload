//====================================================//
//==== Playlist: enter the file names here: ==========//

var allVideos = {
  "videos": [
  {"title": "video 1",
  "h264": "videos/01-16s_h264.mp4",
  "webm": "videos/01-16s_h264.webm",
  "doubleplay": "true",
  "waitmessage": "The video will play again in 5 seconds."
},
{"title": "video 2",
"h264": "videos/02-18s_h264.mp4",
"webm": "videos/02-18s_h264.webm",  
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."
},
{"title": "video 3",
"h264": "videos/03-13s_h264.mp4",
"webm": "videos/03-13s_h264.webm",
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."
},
{"title": "video 4",
"h264": "videos/04-13s_h264.mp4",
"webm": "videos/04-13s_h264.webm",
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."
},
{"title": "video 5",
"h264": "videos/05-22s_h264.mp4",
"webm": "videos/05-22s_h264.webm",
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."
},
{"title": "video 6",
"h264": "videos/magenta_test.mp4",
"webm": "videos/magenta_test.webm",
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."

},
{"title": "video 7",
"h264": "videos/magenta_test2.mp4",
"webm": "videos/magenta_test2.webm",
"doubleplay": "true",
"waitmessage": "The video will play again in 5 seconds."
},
]
};


var randomOrder = true; // set to false if playlist order is non-random

//=== UI control toggles - set to false to remove from UI 
var controlsOn = false; // this must be set to true for any of the below to work
var playOn = false;
var skipOn = false;
var volumeOn =  false;
var muteOn = false;
var durationOn = false;
var seekOn = false;
var fullscOn = false;
//====================================================//
//===================================================//

// html5 video elements
var vidElements = [];
// display index
var vindex = 0;

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

// initialize videojs player and its UI 
var vjsPlayer = function(w, h, i){
  // add videojs player to each video
  var options = {
    "width": w,
    "height": h,

    controlBar: (controlsOn ? {
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
    } : false),
  };
  addVjs("video"+i, options);
  var thisVideo = document.getElementById("video"+vindex);
}; // end vjsplayer function

/// some globals -- todo: refactor this ---//
// video element
var theVideo;
// skipUI buttons - so they can access each other
var prevBtn, nextBtn;

function skipUI(){
  var theVideo = document.getElementById("video"+vindex);

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
      hideVjs(vindex);
      vindex--;
      showVjs(vindex);
      prevBtn.disabled = true;
    }
    else{
      hideVjs(vindex);        
      vindex--;
      showVjs(vindex);
      nextBtn.disabled = false;
    }
  });
  // iterate through video playlist forwards
  nextBtn.addEventListener("click", function(){
    if(vindex == vidElements.length-1 ){
      nextBtn.disabled = true;
    }
    else if(vindex == vidElements.length-2){
      hideVjs(vindex);
      vindex++;
      showVjs(vindex);
      prevBtn.disabled = false;
      nextBtn.disabled = true;
    }
    else{
      hideVjs(vindex);
      vindex++;
      showVjs(vindex);
      prevBtn.disabled = false;
    }

  });

}; // end skipUI function

function addVjs(vidElement, options){
  var thePlayer = videojs(vidElement, options, function(){
    this.addClass("vjs-big-play-centered");
  });
}

function showVjs(i){
  var vidElement = "video"+i;
  $("#vid"+i).show();
  if($("#vid"+i).attr("data-loaded")=="false"){
    $("#progress"+i).show(); 
    $("#progress"+i).attr('value', $("#progress"+i).prop('value')+1).trigger("change");
    $("#progress"+i).on('change', function(){
      if(this.value > 99){
        var newVideo = document.getElementById(vidElement+"_html5_api");
        newVideo.style.display="inline block";
        var theVjs = document.getElementById(vidElement);
        theVjs.style.display="block";
        $("#"+vidElement).addClass("video-js vjs-default-skin");
      }
    })
  }
}

function hideVjs(i){
  var vidElement = "video"+i;
  $("#vid"+i).hide();
  var oldVideo = document.getElementById(vidElement);
    // reset to beginning 
    videojs(oldVideo).pause();
    videojs(oldVideo).currentTime(0);
    oldVideo.style.display="none";
    $("#"+vidElement).removeClass("video-js vjs-default-skin");
  }


// send the appropriate videos to the video loader
var preLoader = function(){
  var vidList = [];
  var vidType ;

  // check browser compatibilty and initiate fall-backs

  if (Modernizr.video.webm){ vidType = "video/webm";}
  else if (Modernizr.video.h264){ vidType = "video/mp4";}
  // if (Modernizr.video.h264){ vidType = "video/mp4";}
  // else if (Modernizr.video.webm){ vidType = "video/webm";}
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
    // add video & progress element for each video
    $("#videos").append('<div id="vid'+i+'" data-loaded="false" data-doubleplay='+allVideos.videos[i].doubleplay+' data-waitmessage="'+allVideos.videos[i].waitmessage+'"><div id="pbar'+i+'"<p class="ptext">Please wait while the video loads.</p><progress id="progress'+i+'" value="2" max="100"></progress></div><video id="video'+i+'"  > Your browser does not support the video tag. </video></div>');
    $("#vid"+i).hide();
    // load the videos into their elements
    loadVid(vidList[i], vidType, i);
    
  }

  // player element w progress bar
  var videoPlayer = document.getElementById("video_player"); 
  videoPlayer.style.display="table";
  $("#video_player").hide();
  // disable right-click in the video player
  videoPlayer.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

};

$(document).ready( preLoader() );

// load the videos asynchronously while the user waits
function loadVid(vidFile, vidType, i){
	var elementID = "video"+i;
  var xhr = new XMLHttpRequest();
  xhr.onprogress = function(e){
    if(e.lengthComputable){
      var perctload = (e.loaded / e.total) *100;
      $("#progress"+i).val(perctload);
      if(perctload == 100){
        $("#vid"+i).attr("data-loaded", "true");
        $("#pbar"+i).hide();
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
      var ltv = loadThisVid(this.response, i);      
    }
  };

  function loadThisVid(response, i){
    var myBlob = response;
    var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
      var video = document.getElementById(elementID);
      video.src = vid;
      video.type=vidType ;
      video.controls=true;
      // update hidden form with play count
      $(video).on('play', function(){
        var v = parseInt($('input[name="'+vidFile+'"]').val());
        $('input[name="'+vidFile+'"]').val(++v);
      });
      vidElements.push(video);
      video.addEventListener( "loadedmetadata", function (e) {
        var width = this.videoWidth,
        height = this.videoHeight;
        vjsPlayer(width, height, i);
        // initialize skip buttons if its the first video
        if(i === 0 && skipOn){ skipUI(); }
      }, false );
    }

    xhr.send();

  }