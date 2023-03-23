
// todo
//   tree branch
//   infinite tree trunk
//   multiplayer
//   leaves explosion WIP
//   crater sprite    COMPLETED
//   sound effects
//   balance
//   motion lines
//   weapons start below player?
//   snake hitbox 1/2 height
//   mobile devices

const GameScreens = {
	Intro:           Symbol.for("Intro"),
	CharacterSelect: Symbol.for("CharacterSelect"),
	WaitingForPlayers: Symbol.for("WaitingForPlayers"),
	Play:            Symbol.for("Play"),
  FinishAnimation: Symbol.for("FinishAnimation")
}

const WeaponTypes = {
	Egg:       Symbol.for("Egg"),
	Acorn:     Symbol.for("Acorn"),
	Spikes:    Symbol.for("Spikes"),
	Fangs:     Symbol.for("Fangs"),
  SlimeBall: Symbol.for("SlimeBall")
}

const Characters = [
  {
    name: "Squirrel",
    spritePath:"assets/sprites/FD_L_Squirrel.png",
    sprite:null,
    stats: {mass: 4, speed: 6, armor: 3, weapon: "Acorn"}
  },
  {
    name: "Turtle",
    spritePath:"assets/sprites/FD_L_Turtle.png",
    sprite:null,
    stats: {mass: 5, speed: 5, armor: 10},
   // easterEggSpritePath:"assets/sprites/FD_L_TurtleSpecial",
   // easterEggSprite:null

  },
  {
    name: "Bird",
    spritePath:"assets/sprites/FD_L_Bird.png",
    sprite:null,
    stats: {mass: 2, speed: 7.5, armor: 1,}
  },
  {
    name: "Hedgehog",
    spritePath:"assets/sprites/FD_L_Hedgehog.png",
    sprite:null,
    stats: {mass: 3.75, speed: 6.5, armor: 8, weapon: "Spikes"}
  },
  {
    name: "Chicken",
    spritePath:"assets/sprites/FD_L_Chicken.png",
    sprite:null,
    stats: {mass: 4, speed: 6, armor: 7, weapon: "Egg"}
  },
  {
    name: "Snake",
    spritePath:"assets/sprites/FD_L_Snake.png",
    sprite:null,
    stats: {mass: 5, speed: 7.5, armor: 3, weapon: "Fangs"}
  },
  {
    name: "Frog",
    spritePath:"assets/sprites/FD_L_Frog.png",
    sprite:null,
    stats: {mass: 4, speed: 6, armor: 4, weapon: "SlimeBall"}
  }
];

const OtherSprites = {
  Cloud1: null,
  Cloud2: null,
  Cloud3: null,
  Cloud1a: null,
  Cloud2a: null,
  Cloud3a: null,
  EggSplat: null,
  Egg: null,
  Acorn: null,
  SlimeBall:null,
  Crater: null,
  Ground: null,
  LeafRed:null,
  LeafGreen:null,
  LeafYellow:null,
  LeafBrown: null,
  ProjectileButton: null,
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
    woundedUntil:0
  },
  {
    id: uuidv4(),
    name: "Sue",
    character: 1, // 0, 1, 2, ... index from Characters array
    positionXPercent: 30,
    positionYPercent: 15,
    facing:"left",
    woundedUntil:0
  },
  {
    id: uuidv4(),
    name: "Jarvis",
    character: 0, // 0, 1, 2, ... index from Characters array
    positionXPercent: 10,
    positionYPercent: 15,
    facing:"left",
    woundedUntil:0
  }
]

let Weapons = []

let Player = {
  id: uuidv4(),
  name: "",
  character: 0, // 0, 1, 2, ... index from Characters array
  positionXPercent: 50,
  positionYPercent: 15,
  facing:"left",
  woundedUntil:0,
  xBoostUntil:0,
  weaponCooldownUntil:0
 // easterEggSpriteSelected: false 
};

const KEY_CODE_SPACEBAR = 32;
const KEY_CODE_LEFT_ARROW = 37;
const KEY_CODE_RIGHT_ARROW = 39;

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
  OtherSprites.Egg = loadImage('assets/sprites/FD_Egg.png');
  OtherSprites.Acorn = loadImage('assets/sprites/FD_Acorn.png');
  OtherSprites.SlimeBall = loadImage('assets/sprites/FD_SlimeBall.png');
  OtherSprites.Logo = loadImage('assets/sprites/FallDamage.png');
  OtherSprites.Crater = loadImage('assets/sprites/FD_Crater.png');
  OtherSprites.Ground = loadImage('assets/sprites/FD_GameEndFloor.png');
  OtherSprites.LeafYellow = loadImage('assets/sprites/FD_LeafYellow.png');
  OtherSprites.LeafRed = loadImage('assets/sprites/FD_LeafRed.png');
  OtherSprites.LeafGreen = loadImage('assets/sprites/FD_LeafGreen.png');
  OtherSprites.LeafBrown = loadImage('assets/sprites/FD_LeafBrown.png');
  OtherSprites.LeafPile = loadImage('assets/sprites/FD_LeafPile.png');
  OtherSprites.EndFrame1 = loadImage('assets/sprites/FD_LeafExplosionFrame1.png')
  OtherSprites.EndFrame2 = loadImage('assets/sprites/FD_LeafExplosionFrame2.png')
  OtherSprites.EndFrame3 = loadImage('assets/sprites/FD_LeafExplosionFrame3.png')
  OtherSprites.EndFrame4 = loadImage('assets/sprites/FD_LeafExplosionFrame4.png')
  OtherSprites.EndFrame5 = loadImage('assets/sprites/FD_LeafExplosionFrame5.png')
  OtherSprites.ProjectileButton = loadImage('assets/Sprites/FD_ProjectileButton.png')
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
  OtherSprites.Crater.resize(50,0);
  OtherSprites.LeafBrown.resize(32,0);
  OtherSprites.LeafRed.resize(32,0);
  OtherSprites.LeafGreen.resize(32,0);
  OtherSprites.LeafYellow.resize(32,0);
  OtherSprites.LeafPile.resize(128,0);

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

  drawLogo(CanvasWidth/2,OtherSprites.Logo.height/2+30);
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





function keyPressed() {
if (GameScreen == GameScreens.Play) {
  if (key == ' ') { // Space Bar
    weaponActivated();
  }
}


}


function weaponActivated() {

  let weaponString = Characters[Player.character].stats.weapon;

  if (weaponString == Symbol.keyFor(WeaponTypes.Acorn)) {

    console.log("throw acorn");
    let cooldown = Player.weaponCooldownUntil - millis();
    console.log("cooldown = ", cooldown);
    if (cooldown <= 0) {
      Weapons.push(
        {
          type: WeaponTypes.Acorn,
          source: Player.id,
          positionXPercent: Player.positionXPercent,
          positionYPercent: Player.positionYPercent,
          yVelocity: 2
        }
        );
      Player.weaponCooldownUntil = millis() + 700; // "fire" refresh rate
    }

  } else if (weaponString == Symbol.keyFor(WeaponTypes.Egg)) {

    console.log("throw egg");
    let cooldown = Player.weaponCooldownUntil - millis();
    console.log("cooldown = ", cooldown);
    if (cooldown <= 0) {
      Weapons.push(
        {
          type: WeaponTypes.Egg,
          source: Player.id,
          positionXPercent: Player.positionXPercent,
          positionYPercent: Player.positionYPercent,
          yVelocity: 1
        }
        );
      Player.weaponCooldownUntil = millis() + 500; // "fire" refresh rate
    }

  } else if (weaponString == Symbol.keyFor(WeaponTypes.SlimeBall)) {

    console.log("throw SlimeBall");
    let cooldown = Player.weaponCooldownUntil - millis();
    console.log("cooldown = ", cooldown);
    if (cooldown <= 0) {
      Weapons.push(
        {
          type: WeaponTypes.SlimeBall,
          source: Player.id,
          positionXPercent: Player.positionXPercent,
          positionYPercent: Player.positionYPercent,
          yVelocity: 5
        }
        );
      Player.weaponCooldownUntil = millis() + 500; // "fire" refresh rate
    }

  } else if (weaponString == Symbol.keyFor(WeaponTypes.Fangs)) {

    console.log("use fangs");
    let cooldown = Player.weaponCooldownUntil - millis();
    console.log("cooldown = ", cooldown);
    if (cooldown <= 0) {
      Player.xBoostUntil = millis() + 333; // accelerated for 1/3rd second
      Player.weaponCooldownUntil = Player.xBoostUntil + 2000; // "fire" refresh rate
    }

  } else if (weaponString == Symbol.keyFor(WeaponTypes.Spikes)) {

    console.log("use spikes");

  } else {

    console.log("no weapon");

  }
}

function updatePlayer() {
  let xMove = massToXAccel(Characters[Player.character].stats.mass);
  let xBoostFactor = 10;
  let xBoost = xBoostFactor * ((Player.xBoostUntil - millis()) / 1000);
  if (xBoost > 0) {
    xMove += xBoost;
  }

  if (keyIsDown(LEFT_ARROW)) {
    Player.facing="left";
    Player.positionXPercent -= xMove;
    if (Player.positionXPercent < 0) {
      Player.positionXPercent = 0;
    } 
  }

  if (keyIsDown(RIGHT_ARROW)) {
    Player.facing="right";
    Player.positionXPercent += xMove;
    if (Player.positionXPercent > 100) {
      Player.positionXPercent = 100;
    }
  }


  if (GameScreen == GameScreens.Play) {
    let yAccel = massToYAccel(Characters[Player.character].stats.mass);
    if (millis() >= Player.woundedUntil) {
      Player.positionYPercent += yAccel;
    } else {
      Player.positionYPercent -= yAccel;
    }
  }
}


function simulateOtherPlayers() {

  for (let i = 0; i < SimulatedPlayers.length; i++) {
    let otherPlayer = SimulatedPlayers[i];
    if (GameScreen == GameScreens.Play) {
      let yAccel = massToYAccel(Characters[otherPlayer.character].stats.mass);
      if (millis() >= otherPlayer.woundedUntil) {
        otherPlayer.positionYPercent += yAccel;
      } else {
        otherPlayer.positionYPercent -= yAccel;
      }
    }
    drawOtherPlayer(otherPlayer, 0, true);
  }
}

function getAdjustedOtherPlayerPositionYPercent(otherPlayer) {

  let effectivePlayerYPercent = getPlayerEffectivePositionYPercent();
  let yPercentOffset = Player.positionYPercent - effectivePlayerYPercent;
  return otherPlayer.positionYPercent - yPercentOffset;
}

function getPlayerEffectivePositionYPercent() {
  let screenLockPercent = 50;
  if (Player.positionYPercent > screenLockPercent) {
    return screenLockPercent;
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

  updateWeapons();
  collideWeapons();
  drawWeapons();
  drawProjectileButton();
  
}

function drawLeavesExplosion(){
  push();
        imageMode(CENTER);
        image(OtherSprites.EndFrame1,CanvasWidth/2,groundYCoord);
        image(OtherSprites.EndFrame2,CanvasWidth/2,groundYCoord);
        image(OtherSprites.EndFrame3,CanvasWidth/2,groundYCoord);
        image(OtherSprites.EndFrame4,CanvasWidth/2,groundYCoord);
        image(OtherSprites.EndFrame5,CanvasWidth/2,groundYCoord);
      pop();
}

const FinishAnimationStates = {
	FASStart:                Symbol.for("FASStart"),
	FASAdvanceToGround:      Symbol.for("FASAdvanceToGround"),
	FASShowGround:           Symbol.for("FASShowGround"),
  FASLandFirstPlacePlayer: Symbol.for("FASLandFirstPlacePlayer"),
  FASExplodeLeaves:        Symbol.for("FASExplodeLeaves"),
  FASLandOtherPlayers:     Symbol.for("FASLandOtherPlayers"),
  FASDone:                 Symbol.for("FASDone")
}
let finishAnimationState = FinishAnimationStates.FASStart;
let finishAnimationYPercentAdvance = 0;
let groundHeight = 100;
let groundYCoord = 0;
let Craters = [];
let playersPlaced = [];
let firstPlacePlayer = null;

function drawFinishAnimationScreen() {
  
  background(SkyColor);
  
  drawClouds();
    
  switch (finishAnimationState) {
    case FinishAnimationStates.FASStart:
    {
      //firstPlacePlayer = getFirstPlacePlayer();
      playersPlaced.push(Player);
      for (let i = 0; i < SimulatedPlayers.length; i++) {
        let otherPlayer = SimulatedPlayers[i];
        playersPlaced.push(otherPlayer);
      }
      // in a sort function, 1 means b has precedence (comes first)
      playersPlaced.sort((a,b) => ((b.positionYPercent > a.positionYPercent) ? 1 : -1));
      firstPlacePlayer = playersPlaced[0];
      playersPlaced.shift();
      
      finishAnimationState = FinishAnimationStates.FASAdvanceToGround;
      break;
    }
    case FinishAnimationStates.FASAdvanceToGround:
    {
      updateCloudsY();

      finishAnimationYPercentAdvance += 5;

      let maxPlayerYCoord = -10000000;

      let tempYCoord = drawPlayer(-finishAnimationYPercentAdvance);
      if (tempYCoord > maxPlayerYCoord) {
        maxPlayerYCoord = tempYCoord;
      }
      for (let i = 0; i < SimulatedPlayers.length; i++) {
        let otherPlayer = SimulatedPlayers[i];
        tempYCoord = drawOtherPlayer(otherPlayer, -finishAnimationYPercentAdvance, true);
        if (tempYCoord > maxPlayerYCoord) {
          maxPlayerYCoord = tempYCoord;
        }
      }

      if (maxPlayerYCoord < -64) {
        // First place player has rolled off the top of the screen
        finishAnimationState = FinishAnimationStates.FASShowGround;
        firstPlacePlayer.positionXPercent = 50;
        groundYCoord = CanvasHeight + groundHeight/2+10;
      }
      break;
    }
    case FinishAnimationStates.FASShowGround:
    {
      drawGround();
      drawLeaves();

      groundYCoord -= 2;
      if (groundYCoord < CanvasHeight-groundHeight/2+5) {
        finishAnimationState = FinishAnimationStates.FASLandFirstPlacePlayer;
        
        firstPlacePlayer.positionYPercent = -5;
        for (let i = 0; i < playersPlaced.length; i++) {
          let player = playersPlaced[i];
          player.positionYPercent = -5;
        }
      }

      break;
    }
    case FinishAnimationStates.FASLandFirstPlacePlayer:
    {
      drawGround();
      firstPlacePlayer.positionYPercent += 5;
      let yCoord = drawOtherPlayer(firstPlacePlayer,0,false);
      drawLeaves();
      if (yCoord >= groundYCoord-10) {
        finishAnimationState = FinishAnimationStates.FASExplodeLeaves;
      }
      break;
    }
    case FinishAnimationStates.FASExplodeLeaves:
    {
      drawGround();
      drawOtherPlayer(firstPlacePlayer,0,false);
      drawLeaves();
      
      if (playersPlaced.length > 0) {
        finishAnimationState = FinishAnimationStates.FASLandOtherPlayers;
      } else {
        finishAnimationState = FinishAnimationStates.FASDone;
      }
      break;
    }
    case FinishAnimationStates.FASLandOtherPlayers:
    {
      drawGround();
      drawCraters();
      drawOtherPlayer(firstPlacePlayer,0,false);
      drawLeavesExplosion();

      playersPlaced[0].positionYPercent += 5;
      let yCoord = drawOtherPlayer(playersPlaced[0],0,false);
      if (yCoord >= groundYCoord-10) {
        Craters.push(playersPlaced[0].positionXPercent);
        playersPlaced.shift();
        if (playersPlaced.length == 0) {
          finishAnimationState = FinishAnimationStates.FASDone;
        }
      }


      break;
    }
    case FinishAnimationStates.FASDone:
    {
      drawGround();
      drawCraters();
      drawOtherPlayer(firstPlacePlayer,0,false);
      push();
        textAlign(CENTER, TOP);
        textSize(16);
        textStyle(BOLD);
        let message = firstPlacePlayer.name + " wins!";
        text(message, CanvasWidth/2, CanvasHeight/2);
      pop();
      break;
    }
    default:
      break;
  }

}

function drawGround() {

  push();
    imageMode(CENTER);
    image(OtherSprites.Ground,CanvasWidth/2,groundYCoord);
  pop();
}

function drawCraters() {
  for (let i = 0; i < Craters.length; i++) {
    let x = percentToX(Craters[i]);
    push();
      imageMode(CENTER);
      image(OtherSprites.Crater,x,groundYCoord-10)  ;
    pop();
  }
}

function drawLeavesB() {

  push();
    ellipseMode(CENTER);
    fill("orange");
    ellipse(CanvasWidth/2,groundYCoord, CanvasWidth/5,groundHeight/2);
  pop();
}

function drawLeaves(){

  push();
  imageMode(CENTER);
    image(OtherSprites.LeafPile,CanvasWidth/2,groundYCoord - 30)
   // image(OtherSprites.LeafBrown,CanvasWidth/2,groundYCoord)
  //  image(OtherSprites.LeafYellow,CanvasWidth/2 + 15,groundYCoord)
   // image(OtherSprites.LeafGreen,CanvasWidth/2 -20,groundYCoord)
    //image(OtherSprites.LeafRed,CanvasWidth/2,groundYCoord +32)
   // image(OtherSprites.LeafGreen,CanvasWidth/2,groundYCoord -15)
    //image(OtherSprites.LeafRed,CanvasWidth/2,groundYCoord +30)
    //image(OtherSprites.LeafBrown,CanvasWidth/2 + 25,groundYCoord +0)
    //image(OtherSprites.LeafYellow,CanvasWidth/2 -30,groundYCoord +20)
  pop();

}

function drawPlayer(percentOffsetY) {
  push();

    imageMode(CENTER);
    let playerXCoord = getPlayerXCoord();
    let playerYCoord = getPlayerYCoord(percentOffsetY);
    if (Player.facing == "right") {
      scale(-1,1);
      playerXCoord = -playerXCoord;
    }

    translate(playerXCoord,playerYCoord);
    let woundedRatio = (Player.woundedUntil - millis()) / 1000;
    if (woundedRatio > 0) {
      angleMode(DEGREES);
      rotate(360 * woundedRatio);
    }
    image(Characters[Player.character].sprite, 0, 0);

  pop();

  return playerYCoord;
}

function getPlayerXCoord() {
  return percentToX(Player.positionXPercent);
}
function getPlayerYCoord(percentOffsetY) {
  return percentToY(getPlayerEffectivePositionYPercent() + percentOffsetY)
}

function getFirstPlacePlayer() {

  let tempFirstPlace = Player;
  for (let i = 0; i < SimulatedPlayers.length; i++) {
    let otherPlayer = SimulatedPlayers[i];
    if (otherPlayer.positionYPercent > tempFirstPlace.positionYPercent) {
      tempFirstPlace = otherPlayer;
    }
  }
  return tempFirstPlace;
}

function drawOtherPlayer(otherPlayer, percentOffsetY, adjusted) {
  push();

    imageMode(CENTER);
    let playerXCoord = getOtherPlayerXCoord(otherPlayer);
    let playerYCoord = getOtherPlayerYCoord(otherPlayer, percentOffsetY, adjusted);
    if (otherPlayer.facing == "right") {
      scale(-1,1);
      playerXCoord = -playerXCoord;
    }

    translate(playerXCoord,playerYCoord);
    let woundedRatio = (otherPlayer.woundedUntil - millis()) / 1000;
    if (woundedRatio > 0) {
      angleMode(DEGREES);
      rotate(360 * woundedRatio);
    }
    image(Characters[otherPlayer.character].sprite, 0, 0);
    
  pop();

  return playerYCoord;
}

function getOtherPlayerXCoord(otherPlayer) {
  return percentToX(otherPlayer.positionXPercent);
}

function getOtherPlayerYCoord(otherPlayer, percentOffsetY, adjusted) {
  if (adjusted == true) {
    return percentToY(getAdjustedOtherPlayerPositionYPercent(otherPlayer) + percentOffsetY);
  } else {
    return percentToY(otherPlayer.positionYPercent + percentOffsetY);
  }
}

function drawTitle(title) {
  push();
    textAlign(CENTER, TOP);
    textSize(32);
    textStyle(BOLD);
    text(title, CanvasWidth*50/100, 10);
  pop();
}

//function drawLogo(x,y) {
 // push();
  //  textAlign(LEFT, TOP);
  //  fill(0);
  //  strokeWeight(0);
  //  textSize(83);
  //  textFont(Fonts.Hatolie);
  //  text("Fall", x,y+30);
  //  textSize(123);
  //  textFont(Fonts.CalligraphyWet);
  //  text("DAMAGE", x+110,y);
 //pop();
//}

function drawLogo(x,y){
  push();
  imageMode(CENTER);
  image(OtherSprites.Logo,x,y);
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

function checkSpriteCollision(spriteA, A_x,A_y, spriteB, B_x,B_y) {
  // sprites A and B must support the properties ".width" and ".height".
  // _x and _y are the CENTER coordinates for the sprites.
  // From those inputs, we derive the following corner coordinates:
  //
  //     |
  //     |(0,0)
  //   --+-------------------------------------------------------->
  //     |  +---------------------------+                       x+
  //     |  |(A_x1,A_y1)                |
  //     |  |            +------------------------------+
  //     |  |      A     |(B_x1,B_y1)   |               |
  //     |  |            |              |               |
  //     |  |            |   (A_x2,A_y2)|       B       |
  //     |  +------------|--------------+               |
  //     |               |                   (B_x2,B_y2)|
  //  y+ |               +------------------------------+
  //     v
  //
  let A_x1 = A_x - spriteA.width/2;
  let A_y1 = A_y - spriteA.height/2;
  let A_x2 = A_x + spriteA.width/2;
  let A_y2 = A_y + spriteA.height/2;
  let B_x1 = B_x - spriteB.width/2;
  let B_y1 = B_y - spriteB.height/2;
  let B_x2 = B_x + spriteB.width/2;
  let B_y2 = B_y + spriteB.height/2;
  return checkRectangularCollision(A_x1,A_y1, A_x2,A_y2, B_x1,B_y1, B_x2,B_y2);
}

function checkRectangularCollision(A_x1,A_y1, A_x2,A_y2, B_x1,B_y1, B_x2,B_y2) {
  // See https://stackoverflow.com/a/31035335 and https://silentmatt.com/rectangle-intersection/
  //
  //     |
  //     |(0,0)
  //   --+-------------------------------------------------------->
  //     |  +---------------------------+                       x+
  //     |  |(A_x1,A_y1)                |
  //     |  |            +------------------------------+
  //     |  |      A     |(B_x1,B_y1)   |               |
  //     |  |            |              |               |
  //     |  |            |   (A_x2,A_y2)|       B       |
  //     |  +------------|--------------+               |
  //     |               |                   (B_x2,B_y2)|
  //  y+ |               +------------------------------+
  //     v
  //
  //  Note that A and B can be anywhere in space. For example, A could be way
  //  over to the right of B and the logic below would still work.
  //
  //  Collision is true if all of these conditions are true:
  return A_x1 < B_x2 && // left edge < other's right edge
         A_x2 > B_x1 && // right edge > other's left
         A_y1 < B_y2 && // top < (above) other's bottom
         A_y2 > B_y1;   // bottom > (below) other's top
}

function collideWeapons() {

  const playerInvincibleTime = 1000;

  // Check Snake attack collision (spacebar must be held)
  if (keyIsDown(KEY_CODE_SPACEBAR) && Characters[Player.character].name == "Snake") {

    const playerWoundedTime = 1000;

    let snakeSprite = Characters[Player.character].sprite;
    let snakeXCoord = getPlayerXCoord();
    let snakeYCoord = getPlayerYCoord(0);
    for (let i = 0; i < SimulatedPlayers.length; i++) {
      let otherPlayer = SimulatedPlayers[i];
      if (otherPlayer.woundedUntil + playerInvincibleTime > millis()) {
        continue;
      } else if (
        checkSpriteCollision(
          snakeSprite,
          snakeXCoord,
          snakeYCoord,
          Characters[otherPlayer.character].sprite,
          getOtherPlayerXCoord(otherPlayer),
          getOtherPlayerYCoord(otherPlayer,0,true))
      ) {
        otherPlayer.woundedUntil = millis() + playerWoundedTime;
        console.log("Snake struck ", Characters[otherPlayer.character].name);
      }
    }
  }

  // Check Hedgehog attack collision
  if (Characters[Player.character].name == "Hedgehog") {

    const playerWoundedTime = 1500;

    let hhSprite = Characters[Player.character].sprite;
    let hhXCoord = getPlayerXCoord();
    let hhYCoord = getPlayerYCoord(0);
    for (let i = 0; i < SimulatedPlayers.length; i++) {
      let otherPlayer = SimulatedPlayers[i];
      if (otherPlayer.woundedUntil + playerInvincibleTime > millis()) {
        continue;
      } else if (
        checkSpriteCollision(
          hhSprite,
          hhXCoord,
          hhYCoord,
          Characters[otherPlayer.character].sprite,
          getOtherPlayerXCoord(otherPlayer),
          getOtherPlayerYCoord(otherPlayer,0,true))
      ) {
        otherPlayer.woundedUntil = millis() + playerWoundedTime;
        console.log("Hedgehog struck ", Characters[otherPlayer.character].name);
      }
    }
  }

  for (let i = 0; i < Weapons.length; i++) {
    let weapon = Weapons[i];

    collidWeaponAndPlayer(weapon, Player, playerInvincibleTime);

    for (let i = 0; i < SimulatedPlayers.length; i++) {
      let otherPlayer = SimulatedPlayers[i];
      collidWeaponAndPlayer(weapon, otherPlayer, playerInvincibleTime);
    }
  }
}

function collidWeaponAndPlayer(weapon, player, invincibleTime) {

  if (player.id == weapon.source) {
    return; // weapons can't hit the player that threw them
  } else if (player.woundedUntil + invincibleTime > millis()) {
    return;
  } else {
    let weaponSprite = getWeaponSprite(weapon);
    let weaponXCoord = getWeaponXCoord(weapon);
    let weaponYCoord = getWeaponYCoord(weapon);
    if (checkSpriteCollision(
          weaponSprite,
          weaponXCoord,
          weaponYCoord,
          Characters[player.character].sprite,
          getOtherPlayerXCoord(player),
          getOtherPlayerYCoord(player,0,true))
    ) {

      let playerWoundedTime = 500; // todo different effects for each weapon.
                                   // todo hedgehog invincible to Egg

      player.woundedUntil = millis() + playerWoundedTime;
      console.log(Symbol.keyFor(weapon.type), " struck ", player.name, "'s ", Characters[player.character].name);
      //drawEggSplat()
    }
  }
}

function updateWeapons() {
  for (let i = 0; i < Weapons.length; i++) {
    let weapon = Weapons[i];
    weapon.positionYPercent += weapon.yVelocity;
  }
}
  function touchEnded(){
    weaponActivated();
  }



function drawWeapons() {
  for (let i = 0; i < Weapons.length; i++) {
    push();

      let weapon = Weapons[i];

      imageMode(CENTER);
      let weaponXCoord = getWeaponXCoord(weapon);
      let weaponYCoord = getWeaponYCoord(weapon);

      translate(weaponXCoord,weaponYCoord);
      image(getWeaponSprite(weapon), 0, 0);
    
    pop();
  }
}

function getWeaponXCoord(weapon) {
  return percentToX(weapon.positionXPercent);
}

function getWeaponYCoord(weapon) {
  return percentToY(getAdjustedWeaponPositionYPercent(weapon));
}

function getAdjustedWeaponPositionYPercent(weapon) {

  let effectiveYPercent = getPlayerEffectivePositionYPercent();
  let yPercentOffset = Player.positionYPercent - effectiveYPercent;
  return weapon.positionYPercent - yPercentOffset;
}

function getWeaponSprite(weapon) {

  if (weapon.type == WeaponTypes.Egg)
  {
    return OtherSprites.Egg;
  }

  if (weapon.type == WeaponTypes.Acorn)
  {
    return OtherSprites.Acorn;
  }
  if (weapon.type == WeaponTypes.SlimeBall)
  {
    return OtherSprites.SlimeBall;
  }
}
function drawProjectileButton(){
push();
  imageMode(CENTER);
  image(OtherSprites.ProjectileButton,40,480);
pop();

}





// Hatolie 83 pt - Fall
// CalligraphyWet 123 pt - DAMAGE