console.clear();

const synth = new Tone.FMSynth({
  harmonicity: 10,
  modulationIndex: 10,
  detune: 0,
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.5
  },
  modulation: {
    type: 'square'
  },
  modulationEnvelope: {
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5
  }
});
// synth.oscillator.type = "sine";
synth.toDestination();

const keyboard = document.querySelector('.keys');
const keys = document.querySelectorAll('.key');
const octaveInput = document.querySelector('#octave');
const octaveButtons = document.querySelectorAll('.octave-button');
const oscillatorSelect = document.querySelector('#oscillator-select');
const oscillatorEnvelope = document.querySelectorAll('.oscillator input');
const modulationSelect = document.querySelector('#modulation-select');
const modulationEnvelope = document.querySelectorAll('.modulation input');

let octave = 4;

// OSCILLATIOR
oscillatorSelect.addEventListener('change', e => {
  synth.oscillator.type = oscillatorSelect.value;
});

for (const oscillatorEnvelopePart of oscillatorEnvelope) {
  oscillatorEnvelopePart.value = synth.envelope[oscillatorEnvelopePart.dataset.envelopePart];
  
  oscillatorEnvelopePart.addEventListener('change', (evt) => {
    synth.envelope[oscillatorEnvelopePart.dataset.envelopePart] = +oscillatorEnvelopePart.value;
  });
}

// MODULATION
modulationSelect.addEventListener('change', e => {
  synth.modulation.type = modulationSelect.value;
});

for (const modulationEnvelopePart of modulationEnvelope) {
  modulationEnvelopePart.value = synth.modulationEnvelope[modulationEnvelopePart.dataset.envelopePart];
  
  modulationEnvelopePart.addEventListener('change', (evt) => {
    synth.modulationEnvelope[modulationEnvelopePart.dataset.envelopePart] = +modulationEnvelopePart.value;
  });
}

// Synth key clicks
keyboard.addEventListener('mousedown', e => {
  if (e.target.dataset.note) {
    synth.triggerAttack(e.target.dataset.note + octave);
  }
});

keyboard.addEventListener('mouseup', e => {
  synth.triggerRelease();
});

// Octave changes
octaveInput.addEventListener('change', e => {
  if (+octaveInput.value > +octaveInput.max) {
    octaveInput.value = +octaveInput.max;
  } else if (+octaveInput.value < +octaveInput.min) {
    octaveInput.value = +octaveInput.min;
  }
  octave = +octaveInput.value;
});

for (const octaveButton of octaveButtons) {
  octaveButton.addEventListener('click', e => {
    let newOctave = +octaveInput.value + +octaveButton.dataset.octaveChange;
    
    if (newOctave > octaveInput.max) {
      newOctave = octaveInput.max;
    } else if (newOctave < octaveInput.min) {
      newOctave = octaveInput.min;
    }
    
    octaveInput.value = newOctave
    
    let event = new Event('change');
    octaveInput.dispatchEvent(event);
  });
}

// Keyboard key presses
document.addEventListener("keydown", e => {
  for (const key of keys) {
    if (key.dataset.keyboardKey && e.key === key.dataset.keyboardKey) {
      key.classList.add('key--active');
      synth.triggerAttack(key.dataset.note + octave);
      break;
    }
  }
});

document.addEventListener("keyup", e => {
  for (const key of keys) {
    if (key.dataset.keyboardKey && e.key === key.dataset.keyboardKey) {
      key.classList.remove('key--active');
      synth.triggerRelease();
      break;
    }
  }
});
