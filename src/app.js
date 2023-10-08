let presetIndex = 0;
let bestPreset;
let playingstart = false;
const playerGroup = document.getElementById("player_group");
const urlSection = document.querySelector(".url");
let visualizer = null;
let rendering = false;
const audio = new Audio();
let audioContext;
const canvas = document.getElementById("canvas");
let group = document.querySelector(".group");
//const playerDisplay = document.querySelector(".player_display");
const player = document.querySelector(".player");
var progress = player.querySelector(".progress");

var playBtn = document.getElementById("playbtn");
var playSvg = playBtn.querySelector(".icon-play");
var playSvgPath = playSvg.querySelector("path");

var loopBtn = document.getElementById("loop");
var looping = false;

var volumeBtn = document.getElementById("volume");
var volumeimg = document.getElementById("volume-img");

const changePreset = document.getElementById("change-preset");

//progress bar
progress.addEventListener(
  "click",
  (e) => {
    const progressWidth = window.getComputedStyle(progress).width;
    const timeToSeek = (e.offsetX / parseInt(progressWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

//click volume slider to change volume

const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.getElementById("volume-amnt").style.width = newVolume * 100 + "%";
  },
  false
);

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = progress.querySelector(".progress-bar");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
}, 500);

//volume button functionality
function volumeToggle() {
  if (volumeBtn.classList.contains("is-active")) {
    audio.muted = false;
    volumeBtn.classList.remove("is-active");
    volumeimg.src = "/assets/volume.png";
  } else {
    volumeimg.src = "/assets/mute.png";
    audio.muted = true;
    volumeBtn.classList.add("is-active");
  }
}
volumeBtn && volumeBtn.addEventListener("click", volumeToggle, false);

//loop button functionality
function loopToggle() {
  if (loopBtn.classList.contains("is-active")) {
    looping = false;
    loopBtn.classList.remove("is-active");
    loopBtn.style.background = "transparent";
  } else {
    looping = true;
    loopBtn.classList.add("is-active");
    loopBtn.style.background = "rgba(255, 255, 255, 0.2)";
  }
}
loopBtn && loopBtn.addEventListener("click", loopToggle, false);

function end() {
  if (!looping) {
    audio.pause();
    //playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
    return;
  } else {
    audio.play();
  }
}
audio.addEventListener("ended", end, false);

async function getData(url) {
  const response = await fetch(url);
  const res = await response.json();
  return res;
}
async function Idata(url) {
  const s = await getData(url);
  visualizer.loadPreset(s, 0.0);
}

//play button functionality
function playToggle() {
  if (audio.paused) {
    audio.play();
    playSvgPath.setAttribute("d", playSvg.getAttribute("data-pause"));
    playingstart = true;

    if(!audioContext)
    {
      audioContext = new AudioContext();
      const audioNode = audioContext.createMediaElementSource(audio);
      audioNode.connect(audioContext.destination);

      visualizer = butterchurn.default.createVisualizer(audioContext, canvas, {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        textureRatio: 1,
      });
    
      // get audioNode from audio source or microphone
    
      visualizer.connectAudio(audioNode);
    
      // load a preset
    
      const presets = butterchurnPresets.getPresets();
      const extrapresets = butterchurnPresetsExtra.getPresets();
      bestPreset =
        [
          extrapresets["Flexi - dimensions, projection and abstraction"],
          presets["flexi - bouncing balls [double mindblob neon mix]"],
          presets["$$$ Royal - Mashup (431)"],
          presets["Cope - The Neverending Explosion of Red Liquid Fire"],
          presets["cope + martin - mother-of-pearl"],
          presets["Eo.S. + Zylot - skylight (Stained Glass Majesty mix)"],
          presets["fiShbRaiN + Flexi - witchcraft 2.0"],
          presets["Flexi - smashing fractals [acid etching mix]"],
          presets["Flexi - truly soft piece of software - this is generic texturing (Jelly) "],
          presets["flexi + amandio c - organic12-3d-2.milk"],
          presets["flexi + fishbrain - neon mindblob grafitti"],
          presets["Goody - The Wild Vort"],
          presets["TonyMilkdrop - Leonardo Da Vinci's Balloon [Flexi - merry-go-round + techstyle]"],
          presets["Unchained - Rewop"],
          presets["Flexi, martin + geiss - dedicated to the sherwin maxawow"]
        ];

      visualizer.loadPreset(bestPreset[presetIndex], 0.0); // 2nd argument is the number of seconds to blend presets
    
      audioContext.resume();

      //set initial size of visualizer and canvas
      visualizer.setRendererSize(window.innerWidth, window.innerHeight);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      function startRenderer() {
        visualizer.render();
        setTimeout(() => {
          startRenderer();
        }, 1000 / 60);
      }

      
      if (!rendering) {
        rendering = true;
        startRenderer();
      }
    }
  } else {
    audio.pause();
    playSvgPath.setAttribute("d", playSvg.getAttribute("data-play"));
  }
}

playBtn && playBtn.addEventListener("click", playToggle, false);

const changeSongURL = function (e) {
  const url = `/direct-url?URL=${urlInput.value}`;
  audio.src = url;
  


};

/*
const changeSongURL = function (e) {
  const url = `/direct-url?URL=${urlInput.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      player.src = data;
    });

  //let filename = player.src.split("\\").pop().split("/").pop();
  //playerDisplay.textContent = filename;
};
*/
// Get the song from:
const urlInput = document.getElementById("url_input");
urlInput.addEventListener("change", changeSongURL, false);

window.addEventListener("resize", ()=> {
  if(visualizer) visualizer.setRendererSize(window.innerWidth, window.innerHeight);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

});
// Playback tempo
const tempoInput = document.getElementById("tempo-input");

const tempo = document.getElementById("tempo");
tempo.addEventListener(
  "click",
  (e) => {
    const tempoWidth = window.getComputedStyle(tempo).width;
    const newTempo = e.offsetX / parseInt(tempoWidth);
    tempoInput.style.width = newTempo * 100 + "%";

    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;
    audio.playbackRate = newTempo * 2;
  },
  false
);

changePreset.addEventListener("click", ()=> {
  if (visualizer) {
    

    if (presetIndex <= 14) visualizer.loadPreset(bestPreset[presetIndex], 0.0);
    if (presetIndex == 15) Idata('assets/cope + flexi - colorful marble (ghost mix).json');
    if (presetIndex == 16) Idata('assets/MilkDrop2077.R033.json');
    if (presetIndex == 17) Idata('assets/yin - 393 - Artificial Inspiration (music driven - outward).json');
    
    if (presetIndex == 17)
    {
      presetIndex = 0;
    }
    else {
      presetIndex++;
    }
  }
});




let Timer = null;
let State = false;
function showFoo(time) {
  if(playingstart) {
    clearTimeout(Timer);
    if (State == true) {
      playerGroup.classList.remove('inactive');
    }
    State = false;
    Timer = setTimeout(function() {
      playerGroup.classList.add('inactive');
      State = true;
    }, time);
  }
}

showFoo(4000);






let Timer2 = null;
let State2 = false;


function showFoos(time) {
  if(playingstart) {
    clearTimeout(Timer2);
    if (State2 == true) {
      urlSection.classList.remove("inactive");
    }
    State2 = false;
    Timer2 = setTimeout(function() {
      urlSection.classList.add("inactive");
      State2 = true;
    }, time);
  }
}

showFoos(4000);

window.addEventListener('mousemove', function(){
    showFoo(4000);
    showFoos(4000);
});

changeSongURL();
