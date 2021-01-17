import { NextApiHandler } from "next";
import getAccessToken from "../../utils/api/accessToken";
import { getSkateabilityScore } from "../../utils/skateability";

export interface ArtistObject {
  id: string;
  name: string;
  uri: string;
}
export interface TrackObject {
  id: string;
  name: string;
  uri: string;
  artists: ArtistObject[];
  duration_ms: number;
  explicit: boolean;
}

export interface AudioFeaturesObject {
  id: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  loudness: number;
  tempo: number;
  valence: number;
}

export interface TrackSkateability {
  track: TrackObject;
  audioFeatures: AudioFeaturesObject;
  skateabilityScore: number;
}

const Skateability: NextApiHandler = async (req, res) => {
  const accessToken = await getAccessToken(req, res);
  if (accessToken === null) {
    return;
  }

  // get long_term top 50 and recent top 50
  const topTracks: TrackObject[] = [];
  const topTracksById: { [key: string]: TrackObject } = {};

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  };

  const longTermQuery = new URLSearchParams({
    time_range: "long_term",
    limit: "50",
  });
  const shortTermQuery = new URLSearchParams({
    time_range: "short_term",
    limit: "50",
  });

  try {
    const longTermTop50Response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?${longTermQuery}`,
      { headers }
    );
    if (longTermTop50Response.status === 200) {
      const data = await longTermTop50Response.json();
      data.items.forEach((item: TrackObject) => {
        topTracksById[item.id] = item;
        topTracks.push(item);
      });
    } else {
      console.log(longTermTop50Response.status);
      console.log("couldn't get long-term tracks");
      throw new Error();
    }
    const shortTermTop50Response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?${shortTermQuery}`,
      { headers }
    );
    if (shortTermTop50Response.status === 200) {
      const data = await shortTermTop50Response.json();
      data.items.forEach((item: TrackObject) => {
        if (item.id in topTracksById) {
          return;
        }
        topTracksById[item.id] = item;
        topTracks.push(item);
      });
    } else {
      console.log(shortTermTop50Response.status);
      console.log("couldn't get short-term tracks");
      throw new Error();
    }
  } catch (e) {
    res.status(500);
    res.send("Couldn't get top tracks");
    return;
  }

  console.log(`There are ${topTracks.length} tracks`);

  // get audio features for all tracks

  const audioFeaturesQuery = new URLSearchParams({
    ids: topTracks.map((track) => track.id).join(","),
  });

  try {
    const audioFeaturesRequest = await fetch(
      `https://api.spotify.com/v1/audio-features?${audioFeaturesQuery}`,
      { headers }
    );
    if (audioFeaturesRequest.status === 200) {
      const data = await audioFeaturesRequest.json();
      const audioFeatures: AudioFeaturesObject[] = data.audio_features;
      const skateabilities = audioFeatures.map((audioFeatures, index) => {
        const track = topTracks[index];
        const skateabilityScore = getSkateabilityScore(audioFeatures);

        return { track, audioFeatures, skateabilityScore };
      });

      res.status(200);
      res.json({
        tracks: skateabilities.sort(
          (a, b) => -(a.skateabilityScore - b.skateabilityScore)
        ),
      });
      return;
    } else {
      console.log("couldn't get audio features");
      console.log(await audioFeaturesRequest.text());
      throw new Error();
    }
  } catch (e) {
    res.status(500);
    res.send("error");
    return;
  }
};

export default Skateability;
