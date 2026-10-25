import { readSoundAsset } from "../services/soundAssets";

type SoundName = "correct" | "wrong" | "timeout" | "tick";

const tones: Record<SoundName, number[]> = {
  correct: [523, 659, 784],
  wrong: [220, 185],
  timeout: [392, 294],
  tick: [740],
};

async function playStoredSound(assetId: string): Promise<void> {
  let objectUrl: string | null = null;
  try {
    const blob = await readSoundAsset(assetId);
    if (!blob) throw new Error("The selected audio file is missing from browser storage.");
    objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    audio.addEventListener("ended", () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }, { once: true });
    await audio.play();
  } catch (error) {
    console.error("SOPHIA: could not play the uploaded audio file.", error);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

export function playSound(name: SoundName, customAssetId?: string): void {
  if (customAssetId) {
    void playStoredSound(customAssetId);
    return;
  }
  try {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const now = context.currentTime;
    tones[name].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(name === "tick" ? 0.045 : 0.08, now + index * 0.12 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + index * 0.12);
      oscillator.stop(now + index * 0.12 + 0.17);
    });
    window.setTimeout(() => void context.close(), tones[name].length * 150 + 300);
  } catch (error) {
    console.warn("SOPHIA: sound playback is unavailable in this browser.", error);
  }
}
