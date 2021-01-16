import { AudioFeaturesObject } from "../pages/api/skateability";

const atLeastZero = (n: number) => Math.max(0, n);

const optimalTempo = 90;
const optimalEnergy = 0.6;

export const getSkateabilityScore = (audioFeatures: AudioFeaturesObject) => {
  const { tempo, energy } = audioFeatures;
  const tempoScore = atLeastZero(100 - Math.abs(tempo - optimalTempo));
  const energyScore = atLeastZero(100 - 10 * Math.abs(energy - optimalEnergy));

  const skateabilityScore = 0.5 * tempoScore + 0.5 * energyScore;

  return skateabilityScore;
};
