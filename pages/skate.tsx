import Head from "next/head";
import styles from "../styles/Skate.module.scss";

// @ts-ignore
import { useSpotifyWebPlaybackSdk } from "use-spotify-web-playback-sdk";
// possibly todo: create my own hook

import { parseCookies } from "nookies";

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
  return (
    <div className={styles.container}>
      <Head>
        <title>SKATE IN SPACE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>Hi skater</h1>
      <p>Playing on device ID {deviceId}</p>
    </div>
  );
};

export default Skate;
