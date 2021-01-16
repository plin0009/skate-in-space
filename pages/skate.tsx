import Head from "next/head";
import styles from "../styles/Skate.module.scss";

// @ts-ignore
import { useSpotifyWebPlaybackSdk } from "use-spotify-web-playback-sdk";
// possibly todo: create my own hook

import { parseCookies } from "nookies";
import { useState } from "react";

import { TrackObject, TrackSkateability } from "./api/skateability";
import { getDisplayDuration } from "../utils/track";
import Footer from "../components/Footer";

const Skate = () => {
  const { player, deviceId, isReady } = useSpotifyWebPlaybackSdk({
    name: "SKATE IN SPACE",
    getOAuthToken: async () => {
      const response = await fetch("/api/refresh");
      if (response.status === 200) {
        const { access_token } = parseCookies();
        return access_token;
      } else {
        throw new Error("Couldn't refresh token");
      }
    },
  });

  const [skateableTracks, setSkateableTracks] = useState<TrackSkateability[]>(
    []
  );

  const [chosenTrack, setChosenTrack] = useState<TrackObject | null>(null);

  const getSkateability = async () => {
    const response = await fetch("/api/skateability");
    if (response.status !== 200) {
      // error
      return;
    }
    const data = await response.json();
    setSkateableTracks(data.tracks);
  };

  const titleText =
    skateableTracks.length === 0 ? "Let's get started" : "Now, choose a song";

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>SKATE IN SPACE</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>{titleText}</h1>
          {skateableTracks.length === 0 ? (
            <button
              onClick={() => {
                getSkateability();
              }}
              className={styles.mainButton}
            >
              Get your most skateable songs
            </button>
          ) : (
            <div className={styles.skateableTracks}>
              {skateableTracks.map(({ track, skateabilityScore }) => (
                <div className={styles.skateTrack} key={track.id}>
                  <button
                    className={styles.playTrackButton}
                    onClick={() => {
                      setChosenTrack(track);
                      // transition to waiting screen for heightmap generation
                    }}
                  >
                    Skate
                  </button>
                  <div className={styles.trackMain}>
                    <p className={styles.trackTitle}>{track.name}</p>
                    <p className={styles.trackArtists}>
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                  <p className={styles.trackDuration}>
                    {getDisplayDuration(track.duration_ms)}{" "}
                  </p>
                  <p className={styles.trackScore}>
                    {Math.round(skateabilityScore)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Skate;
