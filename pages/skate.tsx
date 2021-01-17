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
import ThreeCanvas from "../components/3d/ThreeCanvas";

type SkateMap = any;
type SkateMapStatus = "not loading" | "loading" | "error" | "loaded";

export interface PlayerState {
  paused: boolean;
  position: number;
  positionTime: number; //
}

interface WebPlaybackState {
  paused: boolean;
  position: number;
  track_window: {
    current_track: {
      id: string;
      name: string;
    };
  };
}

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
    onPlayerStateChanged: ({
      paused,
      position,
      track_window: { current_track },
    }: WebPlaybackState) => {
      if (chosenTrack === null || current_track.id !== chosenTrack.id) {
        setSkateMapStatus("not loading");
        setSkateMap(null);
        setPlayerState(null);
        setChosenTrack(null);
      }
      setPlayerState({
        paused,
        position,
        positionTime: new Date().getTime(),
      });
    },
  });

  const [skateableTracks, setSkateableTracks] = useState<TrackSkateability[]>(
    []
  );

  const [chosenTrack, setChosenTrack] = useState<TrackObject | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>(null);

  const [skateMapStatus, setSkateMapStatus] = useState<SkateMapStatus>(
    "not loading"
  );
  const [skateMap, setSkateMap] = useState<SkateMap | null>(null);

  const getSkateability = async () => {
    const response = await fetch("/api/skateability");
    if (response.status !== 200) {
      // error
      return;
    }
    const data = await response.json();
    setSkateableTracks(data.tracks);
  };

  const loadSkateMap = async (track: TrackObject) => {
    setChosenTrack(track);
    setSkateMapStatus("loading"); // transitions to waiting screen

    const response = await fetch(`/api/skatemap?id=${track.id}`);
    if (response.status === 200) {
      const data = await response.json();
      setSkateMap(data);
      setSkateMapStatus("loaded");
    } else {
      setSkateMapStatus("error");
    }
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
        {skateMapStatus === "loaded" ? (
          <ThreeCanvas
            className={styles.canvas}
            skateMap={skateMap}
            playerState={playerState}
          />
        ) : (
          <main className={styles.main}>
            <h1 className={styles.title}>{titleText}</h1>
            {skateMapStatus === "loading" ? (
              <div>Loading skate map</div>
            ) : skateMapStatus === "error" ? (
              <div>
                <p>Error loading skate map</p>
                <button
                  onClick={() => {
                    setSkateMapStatus("not loading");
                  }}
                >
                  Nevermind
                </button>
              </div>
            ) : skateableTracks.length === 0 ? (
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
                        loadSkateMap(track);
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
        )}
      </div>
      <Footer />
    </>
  );
};

export default Skate;
