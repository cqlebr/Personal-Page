let explosion;
let playing = false;
let synth1, part1, seq1, part2, part3, filt, reverb, distortion, noise;
let volumeSlider, filterSlider, reverbSlider, distortionSlider, noiseSlider;

function preload() {
  explosion = loadImage("explosion.gif"); // Load explosion image
}

function setup() {
  createCanvas(600, 600);

  // Create sliders for various controls
  volumeSlider = createSlider(-30, 0, -10, 1); // Volume slider (-30 dB to 0 dB)
  volumeSlider.position(10, height - 40);
  volumeSlider.style('width', '100px');
  
  filterSlider = createSlider(100, 5000, 1500, 100); // Filter frequency slider (100Hz to 5000Hz)
  filterSlider.position(130, height - 40);
  filterSlider.style('width', '100px');
  
  reverbSlider = createSlider(0, 10, 2, 0.1); // Reverb decay time (0s to 10s)
  reverbSlider.position(250, height - 40);
  reverbSlider.style('width', '100px');
  
  distortionSlider = createSlider(0, 1, 0.8, 0.01); // Distortion amount (0 to 1)
  distortionSlider.position(370, height - 40);
  distortionSlider.style('width', '100px');
  
  noiseSlider = createSlider(0, 1, 0.2, 0.01); // Noise amount (0 to 1)
  noiseSlider.position(490, height - 40);
  noiseSlider.style('width', '100px');
  
  // Filter for lowpass effect
  filt = new Tone.Filter(1500, "lowpass").toDestination();

  // Synth setup
  synth1 = new Tone.PolySynth(Tone.Synth).connect(filt);

  // Add reverb to make it feel larger
  reverb = new Tone.Reverb(2).toDestination(); // 2 seconds of reverb decay
  synth1.connect(reverb);

  // Add distortion to make it grittier
  distortion = new Tone.Distortion(0.8).toDestination();
  synth1.connect(distortion);

  // Create part1 for sequence
  part1 = new Tone.Part((time, note) => {
    synth1.triggerAttackRelease(note, "4n", time);
  }, [
    [0, ["C3", "E3", "G3"]],
    ["0:2:1", "F3"],
    ["1:0", "A3"]
  ]);
  part1.loop = true;
  part1.loopEnd = "2m";

  // Create part2 for sequence
  part2 = new Tone.Part((time, value) => {
    synth1.triggerAttackRelease(value.note, value.duration, time);
  }, [
    {time: 0, note: ["D4", "F4", "A4"], duration: "8n"},
    {time: "0:1", note: ["D4", "G4", "B4"], duration: "4n"},
    {time: "0:3", note: ["C#4", "E4", "A4"], duration: "2n"},
    {time: "1:3", note: "A4", duration: "16t"},
    {time: "1:3:1.33", note: "C5", duration: "16t"},
    {time: "1:3:2.67", note: "B4", duration: "16t"}
  ]);
  part2.loop = true;
  part2.loopEnd = "2m";

  // Create part3 for filter modulation
  part3 = new Tone.Part((time, value) => {
    filt.frequency.rampTo(value.freq, value.rampTime, time);
  }, [
    {time: 0, freq: 300, rampTime: 1}
  ]);
}

function draw() {
  background("gray");
  textStyle("bold");
  textSize(14);
  text("Volume", 40, height - 45)
  text("Filter", 160, height - 45)
  text("Reverb", 277, height - 45)
  text("Distortion", 385, height - 45)
  text("Noise", 515, height - 45)

  // Display explosion image if playing
  if (playing) {
    image(explosion, width / 2 - explosion.width / 2, height / 2 - explosion.height / 2);
  }

  // Adjust the synth volume based on the slider value
  let volume = volumeSlider.value(); // Get the value from the volume slider
  synth1.volume.value = volume; // Apply the volume to the synth

  // Adjust the filter frequency based on the filter slider
  let filterFreq = filterSlider.value(); // Get the value from the filter slider
  filt.frequency.value = filterFreq; // Apply to the filter frequency
  
  // Adjust the reverb decay time based on the reverb slider
  let reverbDecay = reverbSlider.value(); // Get the value from the reverb slider
  reverb.decay = reverbDecay; // Apply to the reverb decay
  
  // Adjust the distortion amount based on the distortion slider
  let distortionAmount = distortionSlider.value(); // Get the value from the distortion slider
  distortion.distortion = distortionAmount; // Apply to the distortion
  
  // Adjust the noise level based on the noise slider
  let noiseLevel = noiseSlider.value(); // Get the value from the noise slider
  // You can create an additional noise generator if you want to simulate noise
}

function mousePressed() {
  // Start the Tone context if not already started
  if (Tone.context.state !== 'running') {
    Tone.start();
  }

  playing = true;

  // Start the transport (only once after interaction)
  Tone.Transport.start();

  // Trigger the "boom" sound (strong, short, deep note)
  synth1.triggerAttackRelease(["C2", "E2", "G2"], "1n"); // Lower pitch for a more powerful boom

  // Start the parts
  part1.start(Tone.now());
  part2.start(Tone.now());
  part3.start(Tone.now());
}

function mouseReleased() {
  playing = false;

  // Stop the parts
  part1.stop();
  part2.stop();
  part3.stop();
}
