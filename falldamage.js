
const GameScreens = {
	Intro:           Symbol("Intro"),
	CharacterSelect: Symbol("CharacterSelect"),
	WaitingForPlayers: Symbol("WaitingForPlayers"),
	Play:            Symbol("Play"),
  FinishAnimation: Symbol("FinishAnimation")
}

const Characters = [
  {
    name: "Squirrel",
    spritePath:"assets/sprites/FD_L_Squirrel.png",
    sprite:null,
    stats: {mass: 5, speed: 6, armor: 3}
  },
  {
    name: "Turtle",
    spritePath:"assets/sprites/FD_L_Turtle.png",
    sprite:null,
    stats: {mass: 4, speed: 7, armor: 10},
   // easterEggSpritePath:"assets/sprites/FD_L_TurtleSpecial",
   // easterEggSprite:null

  },
  {
    name: "Bird",
    spritePath:"assets/sprites/FD_L_Bird.png",
    sprite:null,
    stats: {mass: 2, speed: 10, armor: 1}
  },
  {
    name: "Hedgehog",
    spritePath:"assets/sprites/FD_L_Hedgehog.png",
    sprite:null,
    stats: {mass: 3, speed: 6, armor: 8, spike:4}
  },
  {
    name: "Chicken",
    spritePath:"assets/sprites/FD_L_Chicken.png",
    sprite:null,
    stats: {mass: 7, speed: 3, armor: 7}
  },
  {
    name: "Snake",
    spritePath:"assets/sprites/FD_L_Snake.png",
    sprite:null,
    stats: {mass: 5, speed: 9, armor: 3}
  },
  {
    name: "Frog",
    spritePath:"assets/sprites/FD_L_Frog.png",
    sprite:null,
    stats: {mass: 4, speed: 6, armor: 4}
  }
];

const OtherSprites = {
  Cloud1: null,
  Cloud2: null,
  Cloud3: null,
  Cloud1a: null,
  Cloud2a: null,
  Cloud3a: null,
  EggSplat: null
}

let GameScreen = GameScreens.Intro;

let SkyColor;

const Music = {
  Intro: {
    path: "assets/music/FallDamage_Intro_Medium.mp3",
    sound: null
  },
  CharacterSelect: {
    path: "assets/music/FallDamage_CharacterSelectLoop_Medium.mp3",
    sound: null
  },
  Play: {
    path: "assets/music/FallDamage_Play_Medium.mp3",
    sound: null
  },
  FinishAnimation: {
    path: "assets/music/FallDamage_FinishAnimation_Medium.mp3",
    sound: null
  },
}
const SoundEffects = {
  Wind: {
    path: "assets/sounds/FallDamage_Wind_Medium.mp3",
    sound: null
  }
}
let AudioAllowed = false;
let IntroSongPlayed = false;

let Canvas;
let CanvasWidth = 512;
let CanvasHeight = 512;

let CountDownTimestamp = 0;

let CloudOffsetX = -50;
let CloudOffsetY = 0;

const Fonts = {
  Hatolie: null,
  CalligraphyWet: null
}

let SimulatedPlayers = [
  {
    id: uuidv4(),
    name: "Bob",
    character: 0, // 0, 1, 2, ... index from Characters array
    positionXPercent: 70,
    positionYPercent: 15,
    facing:"left",
  },
  {
    id: uuidv4(),
    name: "Sue",
    character: 1, // 0, 1, 2, ... index from Characters array
    positionXPercent: 30,
    positionYPercent: 15,
    facing:"left",
  },
  {
    id: uuidv4(),
    name: "Jarvis",
    character: 2, // 0, 1, 2, ... index from Characters array
    positionXPercent: 10,
    positionYPercent: 15,
    facing:"left",
  }
]

let Player = {
  id: uuidv4(),
  name: "",
  character: 0, // 0, 1, 2, ... index from Characters array
  positionXPercent: 50,
  positionYPercent: 15,
  facing:"left",
 // easterEggSpriteSelected: false 
};

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function preload() {
  // Load assets...

  // Sprites
  for (let i = 0; i < Characters.length; i++) {
    Characters[i].sprite = loadImage(Characters[i].spritePath);
   // if(Object.hasOwn(Characters[i], 'easterEggSpritePath')){
    //  Characters[i].easterEggSprite = loadImage(Characters[i].easterEggSpritePath);
    //}
  }
  OtherSprites.Cloud1 = loadImage('assets/sprites/cloud1_small.png');
  OtherSprites.Cloud2 = loadImage('assets/sprites/cloud2_small.png');
  OtherSprites.Cloud3 = loadImage('assets/sprites/cloud3_small.png');
  OtherSprites.Cloud1a = loadImage('assets/sprites/cloud1_small.png');
  OtherSprites.Cloud2a = loadImage('assets/sprites/cloud2_small.png');
  OtherSprites.Cloud3a = loadImage('assets/sprites/cloud3_small.png');
  OtherSprites.EggSplat = loadImage('assets/sprites/FD_EggSplat.png');

  // Fonts
  Fonts.Hatolie = loadFont('assets/fonts/Hatolie.ttf');
  Fonts.CalligraphyWet = loadFont('assets/fonts/CalligraphyWet.ttf');

  // Sounds
  //IntroSong = loadSound('assets/music/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3');
  for (var name in Music) {
    Music[name].sound = loadSound(Music[name].path);
  }
  for (var name in SoundEffects) {
    SoundEffects[name].sound = loadSound(SoundEffects[name].path);
  }
}

function setup() {

  // mimics the autoplay policy
  getAudioContext().suspend();

  SkyColor = color('lightblue');
  OtherSprites.Cloud1.resize(300,0);
  OtherSprites.Cloud2.resize(300,0);
  OtherSprites.Cloud3.resize(300,0);
  OtherSprites.Cloud1a.resize(500,0);
  OtherSprites.Cloud2a.resize(500,0);
  OtherSprites.Cloud3a.resize(500,0);
  
  CanvasWidth = Math.min(CanvasWidth, displayWidth);
  CanvasHeight = Math.min(CanvasHeight, displayHeight);
  Canvas = createCanvas(CanvasWidth, CanvasHeight);
  Canvas.parent("main");
  Canvas.id("canvas");
  Canvas.style("z-index:0");

  // Prevent scrolling and dragging of the page when a mouse wheel or touch event occurs inside the canvas
  document.getElementById( "canvas" ).onwheel = function(event){ event.preventDefault(); };
  document.getElementById( "canvas" ).onmousewheel = function(event){ event.preventDefault(); };
  document.getElementById( "canvas" ).addEventListener('touchstart', function(e) { document.documentElement.style.overflow = 'hidden'; });
  document.getElementById( "canvas" ).addEventListener('touchend', function(e) { document.documentElement.style.overflow = 'auto'; });

  let UI = createDiv();
  UI.parent("main");
  UI.id("UI");
  UI.style("z-index:1");
  UI.position(0,-CanvasHeight/2, 'relative');
  
  let StartButton = createButton("Start");
  StartButton.parent("UI");
  StartButton.mouseClicked(mouseClicked_IntroScreenStartButton);
  StartButton.addClass("bigbutton");
}

function mouseClicked_IntroScreenStartButton() {

  transitionToCharacterSelectScreen();

  userStartAudio();
  AudioAllowed = true;

  Music.Intro.sound.onended(introSong_onended);
  Music.Intro.sound.play();

}

function introSong_onended(duration) {
  Music.CharacterSelect.sound.loop();
}

function mouseClicked_CharacterSelectScreen_PlayGameButton() {
  
  transitionToWaitingForPlayersScreen();
}

function input_CharacterSelectScreen_NameInput() {
  console.log('you are typing: ', this.value());
  Player.name = this.value();
}

function transitionToCharacterSelectScreen() {

  GameScreen = GameScreens.CharacterSelect;
  //select("UI").remove(); not sure if this would remove its children
  removeElements(); // Removes all p5 elements (so, the UI)

  let UI = createDiv();
  UI.parent("main");
  UI.id("UI");
  UI.style("z-index:1");
  UI.position(0,-CanvasHeight/2, 'relative');
  
  let NameInput = createInput('');
  NameInput.parent("UI");
//  NameInput.value(Player.name);
  //NameInput.size(100);
  NameInput.input(input_CharacterSelectScreen_NameInput);
  NameInput.attribute("placeholder", "What's your name?");

  let P = createP("");
  P.parent("UI");
  P.id("afternameinput");

  let PlayGameButton = createButton("Play Game");
  PlayGameButton.parent("afternameinput");
  PlayGameButton.addClass("bigbutton");
  PlayGameButton.mouseClicked(mouseClicked_CharacterSelectScreen_PlayGameButton);

}

function transitionToWaitingForPlayersScreen() {
  
  GameScreen = GameScreens.WaitingForPlayers;
  removeElements(); // Removes all p5 elements (so, the UI)

  startTimer(5);
}

function transitionToPlayScreen() {
  GameScreen = GameScreens.Play;

  for (var name in Music) {
    Music[name].sound.onended(donothing_onended);
    Music[name].sound.stop();
  }

  Music.Play.sound.onended(playSong_onended);
  Music.Play.sound.play();

  SoundEffects.Wind.sound.play();
}

function donothing_onended(duration) {

}

function playSong_onended(duration) {
  transitionToFinishAnimationScreen();
}

function transitionToFinishAnimationScreen() {
  GameScreen = GameScreens.FinishAnimation;

  SoundEffects.Wind.sound.stop();

  Music.FinishAnimation.sound.play();
}

function draw() {

  switch (GameScreen)
  {
    case GameScreens.Intro:
      drawIntroScreen();
      break;

    case GameScreens.CharacterSelect:
      drawCharacterSelectScreen();
      break;

    case GameScreens.WaitingForPlayers:
      drawWaitingForPlayersScreen();
      break;

    case GameScreens.Play:
      drawPlayScreen();
      break;

    case GameScreens.FinishAnimation:
      drawFinishAnimationScreen();
      break;

    default:
      break;
  }

}

function drawClouds() {
  push();
    translate(CloudOffsetX, CloudOffsetY);
    image(OtherSprites.Cloud1, -10,-20);
    image(OtherSprites.Cloud2, 0,150);
    image(OtherSprites.Cloud3, 0,300);
    push();
      translate(-600, 10);
      image(OtherSprites.Cloud2, -10,-20);
      image(OtherSprites.Cloud3, 0,150);
      image(OtherSprites.Cloud1, 0,300);
      image(OtherSprites.Cloud3a, -100,150);
    pop();
    translate(CloudOffsetX, CloudOffsetY);
    image(OtherSprites.Cloud1a, 200,200);
    image(OtherSprites.Cloud2a, -100,150);
    image(OtherSprites.Cloud3a, 200,300);
    push();
      translate(-700, -100);
      image(OtherSprites.Cloud2a, 200,200);
      image(OtherSprites.Cloud3a, -100,150);
      image(OtherSprites.Cloud1a, 200,300);
    pop();
  pop();
}

function updateCloudsX() {
  CloudOffsetX += 0.01;
}
function updateCloudsY() {
  CloudOffsetY += -0.10;
}

function drawIntroScreen() {
  
  background(SkyColor);
  //drawTitle('Intro'); // todo remove

  updateCloudsX();
  drawClouds();

  drawLogo(70,30);
}

function drawCharacterSelectScreen() {

  // if (!IntroSongPlayed /*!IntroSong.isPlaying()*/ && AudioAllowed) {
  //   IntroSong.play();
  // }

  background(SkyColor);

  updateCloudsX();
  drawClouds();

  drawTitle('Select Your Character'); // todo improve

  for (let i = 0; i < Characters.length; i++) {
    image((Characters[i]).sprite, i*70, 70);
  }

  let xIndex = Math.floor(mouseX / 70);
  let yIndex = Math.floor(mouseY / 70);
  let left = xIndex * 70;
  let top = yIndex * 70;

  // Draw a rounded box around the selected character
  push();
    stroke("#ffeec4");
    strokeWeight(3);
    noFill();
    rect(Player.character*70,70, 64,64, 5);
  pop();
  // Draw a rounded box around the mouse cursor position,
  // but only if it's over a character sprite
  if (xIndex < Characters.length && yIndex == 1) {
    push();
      stroke('white');
      strokeWeight(4);
      noFill();
      drawingContext.shadowBlur = 16;
      drawingContext.shadowColor = color("#ffeec4");
      rect(left,top, 64,64, 5);
    pop();
  }

  // Draw character stats
  push();
    textAlign(LEFT, TOP);
    fill(0);
    strokeWeight(0);
    let tsize = 20;
    textSize(tsize);
    let i = 0;
    for ( var stat in Characters[Player.character].stats ) {
      text(stat + ": " + Characters[Player.character].stats[stat], 200, 150+i*tsize);
      i++;
    }
    // text("mass: " + Characters[Player.character].stats.mass, 200, 150);
    // text("speed: " + Characters[Player.character].stats.speed, 200, 150+30);
    // text("armor: " + Characters[Player.character].stats.armor, 200, 150+60);
  pop();

  // Cursor selection index indicators for debug
  //text(xIndex, 10,10);
  //text(yIndex, 30,10);
 
}
function drawEggSplat(){
  push();
    imageMode(CENTER);
    image(OtherSprites.EggSplat,CanvasWidth/2,CanvasHeight/2);
  pop();
}
function mouseClicked() {

  if (GameScreen == GameScreens.CharacterSelect) {

    let xIndex = Math.floor(mouseX / 70);
    let yIndex = Math.floor(mouseY / 70);

    if (xIndex < Characters.length && yIndex == 1) {
      Player.character = xIndex;
     // if(keyIsDown(SHIFT)==true){
     // easterEggSpriteSelected=true,
     // };
    }
  }
}

function updatePlayer() {

  const LRMove = massToXAccel(Characters[Player.character].stats.mass);

  if (keyIsDown(LEFT_ARROW)) {
    Player.facing="left";
    Player.positionXPercent -= LRMove;
    if (Player.positionXPercent < 0) {
      Player.positionXPercent = 0;
      drawEggSplat();
    }
  }

  if (keyIsDown(RIGHT_ARROW)) {
    Player.facing="right";
    Player.positionXPercent += LRMove;
    if (Player.positionXPercent > 100) {
      Player.positionXPercent = 100;
      drawEggSplat();
    }
  }

  if (GameScreen == GameScreens.Play) {
    //Player.positionYPercent += 1/Characters[Player.character].stats.mass * acceleration;
    Player.positionYPercent += massToYAccel(Characters[Player.character].stats.mass);
  }
}


function simulateOtherPlayers() {

  for (let i = 0; i < SimulatedPlayers.length; i++) {
    if (GameScreen == GameScreens.Play) {
      SimulatedPlayers[i].positionYPercent += massToYAccel(Characters[SimulatedPlayers[i].character].stats.mass);
    }
    drawOtherPlayer(SimulatedPlayers[i]);
  }
}

function getAdjustedOtherPlayerPositionYPercent(otherPlayer) {

  let effectivePlayerYPercent = getPlayerEffectivePositionYPercent();
  let yPercentOffset = Player.positionYPercent - effectivePlayerYPercent;
  return otherPlayer.positionYPercent - yPercentOffset;
}

function getPlayerEffectivePositionYPercent() {
  if (Player.positionYPercent > 80) {
    return 80;
  } else {
    return Player.positionYPercent;
  }
}

let WaitingForPlayersJump_t = 0;

function drawWaitingForPlayersScreen() {
  
  background(SkyColor);

  updateCloudsX();
  drawClouds();

  drawTitle('Waiting for others...');

  let countdownResult = drawCountdown();
  if (false === countdownResult) {

    transitionToPlayScreen();

  } else if (0 === countdownResult) {

    push();
      textAlign(CENTER, TOP);
      textSize(128);
      textStyle(BOLD);
      text("GO!", CanvasWidth/2, CanvasHeight/2);
    pop();

  }

  updatePlayer();

  let PlayerYPercentOffset = 0;
  let jumpProgress = 0;
  if (0 === countdownResult) {
    Music.CharacterSelect.sound.stop();

    jumpProgress = 1 - ((CountDownTimestamp - millis()) / 1000);
    console.log('', WaitingForPlayersJump_t, 'frames -- ', jumpProgress, '% ', CountDownTimestamp, '-', millis(), ' = ', CountDownTimestamp - millis());
    PlayerYPercentOffset = -10 * normal_parabola(jumpProgress);

    //PlayerYPercentOffset = -10 * normal_parabola(WaitingForPlayersJump_t / 60);
    //console.log('', WaitingForPlayersJump_t, 'frames -- ', PlayerYPercentOffset, '% ');
    WaitingForPlayersJump_t++;
  }

  drawPlayer(PlayerYPercentOffset);

  simulateOtherPlayers();

}

function drawPlayScreen() {
  
  background(SkyColor);

  updateCloudsX();
  updateCloudsY();
  drawClouds();

  updatePlayer();
  drawPlayer(0);

  simulateOtherPlayers();
}

function drawFinishAnimationScreen() {
  
  background(SkyColor);

  drawClouds();

  drawTitle('Finish Animation'); // todo remove
}

function drawPlayer(percentOffsetY) {
  push();

    imageMode(CENTER);
    let playerXCoord = percentToX(Player.positionXPercent);
    if(Player.facing=="right"){
      scale(-1,1);
      playerXCoord = -playerXCoord;
    }
    image(
      Characters[Player.character].sprite,
      playerXCoord,
      percentToY(getPlayerEffectivePositionYPercent() + percentOffsetY)
      );

  pop();
}

function drawOtherPlayer(otherPlayer) {
  push();

    imageMode(CENTER);
    let playerXCoord = percentToX(otherPlayer.positionXPercent);
    if(otherPlayer.facing=="right"){
      scale(-1,1);
      playerXCoord = -playerXCoord;
    }
    image(
      Characters[otherPlayer.character].sprite,
      playerXCoord,
      percentToY(getAdjustedOtherPlayerPositionYPercent(otherPlayer))
      );
    
  pop();
}

function drawTitle(title) {
  push();
    textAlign(CENTER, TOP);
    textSize(32);
    textStyle(BOLD);
    text(title, CanvasWidth*50/100, 10);
  pop();
}

function drawLogo(x,y) {
  push();
    textAlign(LEFT, TOP);
    fill(0);
    strokeWeight(0);
    textSize(83);
    textFont(Fonts.Hatolie);
    text("Fall", x,y+30);
    textSize(123);
    textFont(Fonts.CalligraphyWet);
    text("DAMAGE", x+110,y);
  pop();
}

function percentToX(percent) {
  return CanvasWidth * percent/100;
}

function percentToY(percent) {
  return CanvasHeight * percent/100;
}

function massToXAccel(mass) {
  return 0.3 * 10/mass;
}

function massToYAccel(mass) {
  return 0.05 * 10/mass;
  // todo: determine maximum amount of screens to allow any player
  //       to advance within the play time, and scale by that
}

function startTimer(seconds) {
  CountDownTimestamp = millis() + (seconds * 1000);
}

// If the current CountDownTimestamp is still in the future, this
// function draws an appropriate countdown to the canvas. As a
// special case, 0 is not drawn to the canvas. This function
// returns the countdown value as an integer (down to 0), and
// then returns false when the countdown has completed.
function drawCountdown() {

  let countDown = Math.floor((CountDownTimestamp - millis())/1000); // i.e. round down

  if (countDown > 0) {
    push();
      textAlign(CENTER, TOP);
      textSize(128);
      textStyle(BOLD);
      text(countDown, CanvasWidth/2, CanvasHeight/2);
    pop();
  }

  if (countDown >= 0) {
    return countDown;
  } else {
    return false;
  }
}

// normal_parabola(t)
//
//   Formula of a generic parabola:
//
//     h = at^2 + bt + c   ("height" depends on "time" here)
//
//   We want to start at height 0, reach a peak halfway through, and
//   end at height 0. Given these points: (0, 0), (0.5, 1), (1, 0),
//   the solution is h = -4*t^2 + 4*t + 0. With input t that ranges
//   from 0.0 to 1.0, the output domain of h will likewise be 0.0 to
//   1.0 (peaking at 1.0 when t=0.5, then retunring to 0.0).
//   Thus, this is a "normalized" parabola, and its input and output
//   can be trivially scaled based on min/max time and min/max height.
//    
//       h |           (0.5, 1.0)
//         |          *
//         |    *            *
//         | *                  *
//         |*                    *
//       --*----------------------*----------
//    (0.0, 0.0)              (1.0, 0.0)    t
//
function normal_parabola(t) {
  return (-4 * Math.pow(t,2)) + (4 * t);
}

// Hatolie 83 pt - Fall
// CalligraphyWet 123 pt - DAMAGE
