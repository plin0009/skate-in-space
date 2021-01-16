import { NextApiHandler } from "next";
import { parseCookies } from "nookies";

interface ArtistObject {
  id: string;
  name: string;
  uri: string;
}
interface TrackObject {
  id: string;
  name: string;
  uri: string;
  artists: ArtistObject[];
  duration_ms: number;
  explicit: boolean;
}

interface AudioFeaturesObject {
  id: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  loudness: number;
  tempo: number;
  valence: number;
}

const Skateability: NextApiHandler = async (req, res) => {
  const cookies = parseCookies({ req });

  let access_token: string;
  if (!("access_token" in cookies)) {
    if (!("refresh_token" in cookies)) {
      res.status(403);
      res.send("No tokens");
      return;
    }
    const refreshResponse = await fetch("/api/refresh");

    if (refreshResponse.status !== 200) {
      res.status(403);
      res.send("Could not use refresh token");
      return;
    }
    const data = await refreshResponse.json();
    access_token = data.access_token;
  } else {
    access_token = cookies.access_token;
  }

  // get long_term top 50 and recent top 50
  const topTracks: TrackObject[] = [];

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + access_token,
  };

  const longTermQuery = new URLSearchParams({
    time_range: "long_term",
    limit: "50",
  });
  const shortTermQuery = new URLSearchParams({
    time_range: "long_term",
    limit: "50",
  });

  try {
    const longTermTop50Response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?${longTermQuery}`,
      { headers }
    );
    if (longTermTop50Response.status === 200) {
      const data = await longTermTop50Response.json();
      topTracks.push(...data.items);
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
      topTracks.push(...data.items);
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
        const { tempo, energy } = audioFeatures;
        const optimalTempo = 90;
        const optimalEnergy = 0.6;

        const atLeastZero = (n) => Math.max(0, n);

        const tempoScore = atLeastZero(100 - Math.abs(tempo - optimalTempo));
        const energyScore = atLeastZero(
          100 - 10 * Math.abs(energy - optimalEnergy)
        );

        const skateabilityScore = 0.5 * tempoScore + 0.5 * energyScore;

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
      throw new Error();
    }
  } catch (e) {
    res.status(500);
    res.send("error");
    return;
  }
};

export default Skateability;
