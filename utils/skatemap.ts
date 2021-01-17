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
  const { track, sections, segments } = audioAnalysis;
  const heightSegments = Math.round(track.duration / interval);

  const matrix = [];
  let currentSection = 0;
  let currentSegment = 0;

  for (let y = 0; y <= heightSegments; y++) {
    const time = y * interval;

    let distanceForSection = distance(time, sections, currentSection);
    if (currentSection < sections.length - 1) {
      let distanceFromNextSection = distance(
        time,
        sections,
        currentSection + 1
      );
      if (distanceFromNextSection < distanceForSection) {
        distanceForSection = distanceFromNextSection;
        currentSection++;
      }
    }

    let distanceForSegment = distance(time, segments, currentSection);
    if (currentSegment < segments.length - 1) {
      let distanceFromNextSegment = distance(
        time,
        segments,
        currentSegment + 1
      );
      if (distanceFromNextSegment < distanceForSegment) {
        distanceForSegment = distanceFromNextSegment;
        currentSegment++;
      }
    }

    const row = [];
    for (let x = 0; x <= widthSegments; x++) {
      row.push(
        2 *
          (Math.cos(
            (2 * Math.PI * distanceForSection) /
              sections[currentSection].duration
          ) +
            0.5 *
              Math.cos(
                (2 * Math.PI * distanceForSegment) /
                  segments[currentSegment].duration
              )) +
          Math.cos(x / 2)
      );
    }
    matrix.push(row);
  }

  return {
    heights: matrix,
    widthSegments,
    heightSegments,
  };
};

const distance = (time: number, sdc: SDC[], currentIndex: number) => {
  return Math.min(
    time - sdc[currentIndex].start,
    sdc[currentIndex].start + sdc[currentIndex].duration - time
  );
};

export default getSkateMap;
