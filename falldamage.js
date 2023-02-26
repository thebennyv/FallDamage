
const GameScreens = {
	Intro:           Symbol("Intro"),
	CharacterSelect: Symbol("CharacterSelect"),
	Play:            Symbol("Play"),
  FinishAnimation: Symbol("FinishAnimation")
}

const Characters = [
  {
    name: "Squirrel",
    spritePath:"assets/sprites/squirrel.png",
    sprite:null,
    stats: {mass: 5}
  },
  {
    name: "Turtle",
    spritePath:"assets/sprites/turtle.png",
    sprite:null,
    stats: {mass: 4}
  },
  {
    name: "Bird",
    spritePath:"assets/sprites/bird.png",
    sprite:null,
    stats: {mass: 2}
  },
  {
    name: "Hedgehog",
    spritePath:"assets/sprites/hedgehog.png",
    sprite:null,
    stats: {mass: 3}
  },
  {
    name: "Chicken",
    spritePath:"assets/sprites/chicken.png",
    sprite:null,
    stats: {mass: 7}
  }
];

const OtherSprites = {
  Cloud1: null,
  Cloud2: null,
  Cloud3: null,
  Cloud1a: null,
  Cloud2a: null,
  Cloud3a: null
}

let GameScreen = GameScreens.Intro;

let SkyColor;

let IntroSong;
let AudioAllowed = false;

let Canvas;
let CanvasWidth = 512;
let CanvasHeight = 512;

const Fonts = {
  Hatolie: null,
  CalligraphyWet: null
}

let Player = {
  id: uuidv4(),
  name: "What's your name?",
  character: 0, // 0, 1, 2, ... index from Characters array
  positionXPercent: 50,
  positionYPercent: 0
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
  }

  Fonts.Hatolie = loadFont('assets/fonts/Hatolie.ttf');
  Fonts.CalligraphyWet = loadFont('assets/fonts/CalligraphyWet.ttf');

  OtherSprites.Cloud1 = loadImage('assets/sprites/cloud1_small.png');
  OtherSprites.Cloud2 = loadImage('assets/sprites/cloud2_small.png');
  OtherSprites.Cloud3 = loadImage('assets/sprites/cloud3_small.png');
  OtherSprites.Cloud1a = loadImage('assets/sprites/cloud1_small.png');
  OtherSprites.Cloud2a = loadImage('assets/sprites/cloud2_small.png');
  OtherSprites.Cloud3a = loadImage('assets/sprites/cloud3_small.png');

  // Sounds
  IntroSong = loadSound('assets/music/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3');
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
  NameInput.value(Player.name);
  //NameInput.size(100);
  NameInput.input(input_CharacterSelectScreen_NameInput);

  let P = createP("");
  P.parent("UI");
  P.id("afternameinput");

  let PlayGameButton = createButton("Play Game");
  PlayGameButton.parent("afternameinput");
  PlayGameButton.addClass("bigbutton");
  PlayGameButton.mouseClicked(mouseClicked_CharacterSelectScreen_PlayGameButton);

}

function mouseClicked_CharacterSelectScreen_PlayGameButton() {

}

function input_CharacterSelectScreen_NameInput() {
  console.log('you are typing: ', this.value());
  Player.name = this.value();
}

// function mousePressed() {
//   userStartAudio();
//   AudioAllowed = true;
// }

function draw() {

  switch (GameScreen)
  {
    case GameScreens.Intro:
      drawIntroScreen();
      break;

    case GameScreens.CharacterSelect:
      drawCharacterSelectScreen();
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

function drawIntroScreen() {
  
  background(SkyColor);

  image(OtherSprites.Cloud1, -10,-20);
  image(OtherSprites.Cloud2, 0,150);
  image(OtherSprites.Cloud3, 0,300);
  image(OtherSprites.Cloud1a, 200,200);
  image(OtherSprites.Cloud2a, -100,150);
  image(OtherSprites.Cloud3a, 200,300);
  //drawTitle('Intro'); // todo remove

  drawLogo(70,30);

  if (!IntroSong.isPlaying() && AudioAllowed) {
    IntroSong.play();
  }
}

function drawCharacterSelectScreen() {

  background(SkyColor);

  image(OtherSprites.Cloud1, -10,-20);
  image(OtherSprites.Cloud2, 0,150);
  image(OtherSprites.Cloud3, 0,300);
  image(OtherSprites.Cloud1a, 200,200);
  image(OtherSprites.Cloud2a, -100,150);
  image(OtherSprites.Cloud3a, 200,300);

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
    stroke('yellow');
    strokeWeight(2);
    noFill();
    rect(Player.character*70,70, 64,64, 5);
  pop();
  // Draw a rounded box around the mouse cursor position,
  // but only if it's over a character sprite
  if (xIndex < Characters.length && yIndex == 1) {
    push();
      stroke('white');
      strokeWeight(2);
      noFill();
      drawingContext.shadowBlur = 16;
      drawingContext.shadowColor = color("blue");
      rect(left,top, 64,64, 5);
    pop();
  }
  text(xIndex, 10,10);
  text(yIndex, 30,10);

}

function mouseClicked() {

  if (GameScreen == GameScreens.CharacterSelect) {

    let xIndex = Math.floor(mouseX / 70);
    let yIndex = Math.floor(mouseY / 70);

    if (xIndex < Characters.length && yIndex == 1) {
      Player.character = xIndex;
    }
  }
}

function drawPlayScreen() {
  
  background(SkyColor);

  drawTitle('Play'); // todo remove
}

function drawFinishAnimationScreen() {
  
  background(SkyColor);

  drawTitle('Finish Animation'); // todo remove
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

// Hatolie 83 pt - Fall
// CalligraphyWet 123 pt - DAMAGE
