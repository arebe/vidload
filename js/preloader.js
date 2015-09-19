//====================================================//
//==== Preloader.js =================================//

// Created by RB (@roastbeest)
// pre-loads a playlist of videos asynchronously

// It takes an input of a JSON obj in the format:
// {
//     "options": {
//       "controlsOn": "false",
//       "playOn": "false",
//       "volumeOn": "false",
//       "muteOn": "false",
//       "durationOn": "false",
//       "seekOn": "false",
//       "fullscOn": "false",
//     },
//     "videos": [
//     {"title": "video 1",
//     "h264": "videos/01-16s_h264.mp4",
//     "webm": "videos/01-16s_h264.webm",
//     "doubleplay": "true",
//     "waitmessage": "The video will play again in 5 seconds."
//     },
//     {etc.},
//     ]
// }

//====================================================//
//===================================================//

var preLoader = function(viddata){
  // video file list
  var vidList = [];
  // html5 video elements
  var vidElements = [];
  var vidType ;
  var allVideos = viddata;

  var controlsOn = JSON.parse(viddata.options.controlsOn); // this must be set to true for any of the below to work
  var playOn = JSON.parse(viddata.options.playOn);
  var volumeOn =  JSON.parse(viddata.options.volumeOn);
  var muteOn = JSON.parse(viddata.options.muteOn);
  var durationOn = JSON.parse(viddata.options.durationOn);
  var seekOn = JSON.parse(viddata.options.seekOn);
  var fullscOn = JSON.parse(viddata.options.fullscOn);

  // check browser compatibilty and initiate fall-backs
  if (Modernizr.video.h264){ vidType = "video/mp4";}
  else if (Modernizr.video.webm){ vidType = "video/webm";}
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
      default:
      console.log("no html5 video support :( ");
    }
  }

  // start loading the videos  
  for (var i = 0; i < vidList.length; i++) {
    // add form elements to track play count
    $('form[name="myForm"]').append('<input type="hidden" name="'+vidList[i]+'" value="0" />');
    // add video & progress element for each video
    $("#videos").append('<div id="vid'+i+'" data-loaded="false" data-visible="false" data-doubleplay='+allVideos.videos[i].doubleplay+' data-waitmessage="'+allVideos.videos[i].waitmessage+'" data-playcount=0><div id="pbar'+i+'"<p class="ptext">Please wait while the video loads.</p><div id="progress'+i+'" class="progressBar"><div></div></div></div><video id="video'+i+'"  > Your browser does not support the video tag. </video></div>');
    $("#vid"+i).hide();
    // style progress bar
    //$("#progress"+i).progressbar();((
    progress(1, $("#progress"+i));
    // load the videos into their elements
    loadVid(vidList[i], vidType, i);
    
  }

  // player element (video + progress text + progress bar)
  var videoPlayer = document.getElementById("video_player"); 
  videoPlayer.style.display="table";
  $("#video_player").hide();
  // disable right-click in the video player
  videoPlayer.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

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
    if (controlsOn === false){
      $("#video"+i).css("pointer-events", "none");
    }
  }; // end vjsplayer function

  function addVjs(vidElement, options){
    var thePlayer = videojs(vidElement, options, function(){
      this.addClass("vjs-big-play-centered");
    });
  }

  // load the videos asynchronously while the user waits
  function loadVid(vidFile, vidType, i){
  	var elementID = "video"+i;
    var xhr = new XMLHttpRequest();
    xhr.onprogress = function(e){
      if(e.lengthComputable){
        var perctload = Math.round((e.loaded / e.total) *100);
        progress(perctload, $("#progress"+i));
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
        $("#vid"+i).attr("data-width", width);
        $("#vid"+i).attr("data-height", height);
        if($("#vid"+i).attr("data-visible") === "true"){
            videojs("video"+i).play();
        }
      }, false );
      video.addEventListener("ended", function(e){
        var playcount = parseInt($("#vid"+i).attr("data-playcount"));
        if ($("#vid"+i).attr("data-doubleplay")==="true" && playcount < 1){
          console.log($("#vid"+i).attr("data-waitmessage"));
          $("#video"+i).hide();
          $("#vid"+i).append('<div id="wait'+i+'"><p class="wtext">'+$("#vid"+i).attr("data-waitmessage")+'</p></div>');
          $("#wait"+i).css({
            "min-width": $("#vid"+i).attr("data-width")+"px",
            "min-height": $("#vid"+i).attr("data-height")+"px",
          });
          $("#wait"+i).show();
          var playAgain = window.setInterval(function(){
            console.log("play again!");
            $("#wait"+i).hide();
            $("#video"+i).show();
            videojs("video"+i).play();
            $("#vid"+i).attr("data-playcount", playcount+1);
            clearInterval(playAgain);
          }, 5000);

        }
      })
    }
    xhr.send();
  }

  // update progress bar
  function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500);
  }
};