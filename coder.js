var tf = require('@tensorflow/tfjs-node');

let Mic = require('node-microphone');
const Speaker = require('speaker');
var RATE = 16000;
var bufSz = 1;
var training = true;
var sampleBuffer = []
var trainTimeout = 1000 * 20
const speaker = new Speaker({
  channels: 1,          // 2 channels
  bitDepth: 16,        // 16-bit samples
  sampleRate: RATE,     // 44,100 Hz sample rat
  signed: true,
  float: false
});

let mic = new Mic({
	device: 'default',
	rate: RATE,
	bitwidth: 16,
   	channels: 1,
    float: false
});
let micStream = mic.startRecording();


micStream.on('data', async data => {

    if (data.length != RATE/4) return;

    var sample = new Array();
    for (var i = 0; i < RATE/8; i++) {
        sample.push(data.readInt16LE(i*2))
    }

    for (var i = 0; i < sample.length; i++) {
        sample[i] = sample[i] + sample[i] % 220
    }


        var buf = Buffer.alloc(RATE/4);
        for (var i = 0; i < sample.length; i++) {
            buf.writeInt16LE(sample[i], i*2)
        }

      

        speaker.write(buf)
})
