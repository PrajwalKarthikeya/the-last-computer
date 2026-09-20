// Ambient sound design for THE LAST COMPUTER

// Initialize audio context and load/synthesize ambient sounds
window.initAudio = function() {
  // We'll use the Web Audio API to create procedural ambient sounds
  // Since we cannot use external assets, we'll generate sounds programmatically

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    console.warn('Web Audio API not supported');
    return;
  }

  const audioContext = new AudioContext();

  // Create a low hum (computer fan/hard drive)
  const createHum = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 120; // Low hum around 120Hz

    gainNode.gain.value = 0.01; // Very quiet

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    return { oscillator, gainNode };
  };

  // Create occasional subtle clicks/distant beeps
  const createRandomClick = () => {
    setTimeout(() => {
      const noiseBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 0.1, audioContext.sampleRate);
      const noise = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        noise[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = audioContext.createGain();
      noiseGain.gain.value = 0.005; // Very subtle

      noiseSource.connect(noiseGain);
      noiseGain.connect(audioContext.destination);

      noiseSource.start();
    }, Math.random() * 10000 + 5000); // Every 5-15 seconds
  };

  // Start the hum
  const hum = createHum();

  // Start random clicks
  createRandomClick();

  // Expose a method to stop audio if needed (not used in this experience)
  return {
    stop: () => {
      hum.oscillator.stop();
      audioContext.close();
    }
  };
};