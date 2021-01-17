import Head from "next/head";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";

const Home = () => {
  const host =
    process.env.NODE_ENV === "production"
      ? "https://skatein.space"
      : `http://localhost:3000`;
  const redirectUri = `${host}/api/callback`;
  const scope = [
    "playlist-modify-public",
    "user-top-read",
    "user-read-private",
    "streaming",
  ].join("%20");

  const authURL = `https://accounts.spotify.com/authorize?client_id=374a99709a344c528f65d921b499cf87&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>SKATE IN SPACE</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Ride out to your favourite tracks.</h1>

          <p className={styles.description}>
            We'll need control of your Spotify account.
          </p>

          <a href={authURL} className={styles.spotifybutton}>
            Log in with Spotify
          </a>
          <p className={styles.warning}>
            Note: unfortunately I did not have time to consider Spotify Free
            users. Additionally, the current deployment you are on only works
            for short (~1 min) songs due to my unoptimized serverless functions
            timing out.
          </p>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
