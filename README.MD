HTML5 Video Preloader
======================

*Created by*: Rachel B [arebe.us](http://arebe.us) [@roastbeest](http://www.twitter.com/roastbeest)

*Prototype Website*: [zebblerstudios.com/test/html5preloader](http://zebblerstudios.com/test/html5preloader)

What's all this?
----------------

Prototype video player designed to:

* pre-load a list of video files, fully buffered
* display videos once all of the playlist has loaded
* minimal transport controls
* supported by latest versions of Firefox, Chrome, Safari, and IE

How to use this module
----------------------
Include the *preloader.js* file in your web application, along with references to its dependencies (included here in *js/libs* ). 

Call the preloader by passing it a JSON object in the format:

``` html
var allVideos = {
    "options": {
      "controlsOn": "false",
      "playOn": "false",
      "volumeOn": "false",
      "muteOn": "false",
      "durationOn": "false",
      "seekOn": "false",
      "fullscOn": "false",
    },
    "videos": [
    {"title": "video 1",
    "h264": "videos/01-16s_h264.mp4",
    "webm": "videos/01-16s_h264.webm",
    "doubleplay": "true",
    "waitmessage": "The video will play again in 5 seconds."
    },
    {etc.},
    ]
}

```

Initialize the preloader with something like: 

`$(document).ready( preLoader(allVideos) );`


License
-------
Original code in this repo is licensed under [MIT License](https://opensource.org/licenses/MIT). Its dependencies include Modernizr.js and jQuery (MIT license), and Video.js ([Apache license](https://github.com/videojs/video.js/blob/stable/LICENSE)).

*HTML5 Preloader* was produced for Zebbler Studios [zebblerstudios.com](http://zebblerstudios.com/)