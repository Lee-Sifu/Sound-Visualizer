var waveform; //global var for graphic's shape & form
var sound; //global var for adding sound
var analyzer; //global var for analyzed freq
var size; //global var for level's size
var level; //global var for sound level
var amplitude; //global var for amplitude
var bass, mid, treble; //global var for audio frequency 
var bass_col, mid_col, treble_col; //global var for audio frequency's 
var fft; //global var for frequency
var trail=[]; //global var for trail effect
var r; //global var for mouse trail
var b; //global var for mouse trail

// Preload function allows me to add sound file of choice
function preload() {
  sound = loadSound("My Name.m4a"); //Disclaimer! All rights belong to the original creators (From Ashes to New)
}

function setup() {
  let cnv = createCanvas(500, 500); //Creates canvas

  amplitude = new p5.Amplitude();
  angleMode(DEGREES);
  
// Each frequency's parameter
  bass = random(125);
  mid = random(255);
  treble = random(255);
  cnv.mouseClicked(togglePlay); // Allows mouse clicks on canvas
  fft = new p5.FFT();
}

// Creates mouse trail effect
function draw() {
  r = map(mouseX, 0, 400, 0, 255);
  b = map(mouseY, 0, 400, 0, 255);

  // Add a new point to the trail
  trail.push({
    x: mouseX,
    y: mouseY,
    diameter: 10,
    alpha: 255, // Initial alpha value for fading effect
  });
  
  // Draw and update the trail
  for (let i = 0; i < trail.length; i++) {
    fill(0,0,0,0.5, trail[i].alpha); // Adjust the color with alpha for fading
    ellipse(trail[i].x, trail[i].y, trail[i].diameter);

    // Update alpha value for fading
    trail[i].alpha -= 100; // Adjust the fading speed (Right now trail doesn't really fade)
  }
   // Remove faded points from the beginning of the trail
  while (trail.length > 0 && trail[0].alpha <= 0) {
    trail.shift();
  }



 // Gets amplitude of the frequency's energy
 let bassValue = fft.getEnergy('bass');
 let midValue = fft.getEnergy('mid');
 let trebleValue = fft.getEnergy('treble');

  fill(r, midValue, b);

  bg_col();
  shapeMaker();
  waveform = fft.waveform();
  let spectrum = fft.analyze();

  fill(bassValue / 4, midValue / 4, trebleValue / 4);

  for (let i = 80; i < waveform.length; i++) {
   let x = map(i, 0, waveform.length, 0, width);
    let h = -height + map(waveform[i], 0, 255, height, 0);
    rect(x, height, width / waveform.length, h);
  }
}
// Function allows Shapes to interact with sound
function shapeMaker() {
   beginShape();
  
  stroke(255);

  let level = amplitude.getLevel();
  let size = map(level, 0, 1, 50, 500);

  circle(55,55,size / 2); // Shape
  
  circle(100,100,size / 2); // Shape
  
   circle(400,400,size / 2); // Shape
  
  circle(450, 450,size / 2); // Shape
  //circle(100,450, size / 2);  
 //circle(24,24, size / 2); // I wasn't able to get some shapes on the other two corners
  
  translate(width / 2, height / 2);
  rotate(size);
  
// sine wave tutorial by colour coding
  for (let i = 0; i < 359; i++) {  // Sine formula used to create main interactive shape
    var r1Min = map(sin(frameCount) - 1, 1, 50, 100, 0);
    var r1Max = map(sin(frameCount) - 1, 1, 100, 0, 100);

    var r2Min = map(sin(frameCount) - 1, 1, 100, 50, 90);
    var r2Max = map(sin(frameCount) - 1, 1, 0, 100, 47);

     //bassMap = map(round(bass,0,255,5,10));
    var r1 = map(sin(i * 10), -1, 1, r1Min, r1Max);
    var r2 = map(sin(i * 30), -1, 1, r2Min, r2Max);
    
    var r = r1 + r2;

    let x = r * cos(i);
    let y = r * sin(i);
   
    vertex(x, y);
  }
  endShape(CLOSE);


}
// When mouse is clicked on screen the sound plays.
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function bg_col() {  //Maps each parameter of the color base on the sound
  bass_col = map(bass, 2, 255, 0, 255);
  treble_col = map(treble, 0, 255, 0, 255);
  mid_col = map(mid, 90, 255, 100, 255);

  background(bass_col, mid_col, treble_col, 15); // Changes random background color after each play
}
function mouseClicked() {
  trail = []; // Clear the trail when the mouse is clicked
}
