// number of seconds per uhhhh height segment
const interval = 0.25;
const widthSegments = 50;

interface AudioAnalysisObject {
  track: Section & {
    duration: number;
    offset_seconds: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
  };
  bars: SDC[];
  beats: SDC[];
  tatums: SDC[];
  segments: (SDC & {
    loudness_start: number;
    loundess_max_time: number;
    loudness_max: number;
    loudness_end: number;
    pitches: number[];
    timbre: number[];
  })[];
  sections: (SDC & Section)[];
}

interface SDC {
  start: number;
  duration: number;
  confidence: number;
}

interface Section {
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

export interface SkateMap {
  heights: number[][];
  widthSegments: number;
  heightSegments: number;
}

const getSkateMap = (audioAnalysis: AudioAnalysisObject): SkateMap => {
  // start with 2d heightmap
  const { track, sections } = audioAnalysis;
  const heightSegments = Math.round(track.duration / interval);

  const matrix = [];
  for (let y = 0; y <= heightSegments; y++) {
    const row = [];
    for (let x = 0; x <= widthSegments; x++) {
      row.push(Math.cos(x / 2) * Math.cos(y) * 3);
    }
    matrix.push(row);
  }

  return {
    heights: matrix,
    widthSegments,
    heightSegments,
  };
};

export default getSkateMap;
