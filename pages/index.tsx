import Head from "next/head";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";

const Home = () => {
  return (
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

        <button>Log in with Spotify</button>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
