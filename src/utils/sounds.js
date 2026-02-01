// Sound effects utility for tip jar

// Create audio context for sounds
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Generate cha-ching sound programmatically (no external file needed)
export const playTipSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillators for coin sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // High-pitched coin sound
    osc1.frequency.setValueAtTime(1567.98, now); // G6
    osc1.frequency.setValueAtTime(2093.0, now + 0.1); // C7

    osc2.frequency.setValueAtTime(1318.51, now); // E6
    osc2.frequency.setValueAtTime(1567.98, now + 0.1); // G6

    osc1.type = "sine";
    osc2.type = "sine";

    // Volume envelope
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);

    return true;
  } catch (error) {
    console.log("Sound not supported:", error);
    return false;
  }
};

// Play success sound (longer, more triumphant)
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

    return true;
  } catch (error) {
    console.log("Sound not supported:", error);
    return false;
  }
};

// Mute control
let isMuted = false;

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => isMuted;

export const playSoundIfEnabled = (soundFn) => {
  if (!isMuted) {
    return soundFn();
  }
  return false;
};
