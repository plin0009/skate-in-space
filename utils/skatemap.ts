// number of seconds per uhhhh height segment
export const segmentInterval = 0.1;
const widthSegments = 100;

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
    loudness_max_time: number;
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
  const { track, sections, beats } = audioAnalysis;
  const heightSegments = Math.round(track.duration / segmentInterval);

  const matrix = [];
  let currentSection = 0;
  let currentBeat = 0;

  for (let y = 0; y <= heightSegments; y++) {
    const time = y * segmentInterval;

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

    let distanceForBeat = distance(time, beats, currentBeat);
    if (currentBeat < beats.length - 1) {
      let distanceFromNextBeat = distance(time, beats, currentBeat + 1);
      if (distanceFromNextBeat < distanceForBeat) {
        distanceForBeat = distanceForBeat;
        currentBeat++;
      }
    }

    const row = [];
    for (let x = 0; x <= widthSegments; x++) {
      let height = -2;
      height +=
        4 *
        Math.cos(
          (2 * Math.PI * distanceForSection) / sections[currentSection].duration
        );

      height += Math.cos(x / 3) / 2;

      height -=
        2 *
        Math.cos(((x + y - widthSegments / 2) * 2 * Math.PI) / widthSegments);

      if (false && x >= widthSegments / 2) {
        height +=
          0 *
          (-0.1 +
            0.2 *
              Math.cos(
                (2 * Math.PI * distanceForBeat) / beats[currentBeat].duration
              ));
      }

      /*
       *if (true || x >= widthSegments / 2) {
       *  if (sections[currentSection].loudness < track.loudness) {
       *    height -= Math.sqrt(
       *      track.loudness - sections[currentSection].loudness
       *    );
       *  } else {
       *    height += Math.sqrt(
       *      sections[currentSection].loudness - track.loudness
       *    );
       *  }
       *}
       */

      row.push(height);
    }
    matrix.push(row);
    if (y === heightSegments) {
      for (let i = 0; i < 20; i++) {
        matrix.push(row);
      }
    }
  }

  return {
    heights: matrix,
    widthSegments,
    heightSegments: heightSegments + 20,
  };
};

const distance = (time: number, sdc: SDC[], currentIndex: number) => {
  if (time - sdc[currentIndex].start < 0) {
    return Infinity;
  }
  if (sdc[currentIndex].start + sdc[currentIndex].duration - time < 0) {
    return Infinity;
  }
  return Math.min(
    time - sdc[currentIndex].start,
    sdc[currentIndex].start + sdc[currentIndex].duration - time
  );
};

export default getSkateMap;
