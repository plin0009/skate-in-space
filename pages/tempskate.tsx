import { useEffect, useState } from "react";
import { Canvas } from "react-three-fiber";
import SkateMapPlane from "../components/3d/SkateMapPlane";
import ThreeCanvas from "../components/3d/ThreeCanvas";
import Footer from "../components/Footer";
import styles from "../styles/TempSkate.module.scss";
import { SkateMap } from "../utils/skatemap";

type SkateMapStatus = "not loading" | "loading" | "error" | "loaded";
const TempSkate = () => {
  const [skateMapStatus, setSkateMapStatus] = useState<SkateMapStatus>(
    "not loading"
  );

  const [skateMap, setSkateMap] = useState<SkateMap | null>(null);

  useEffect(() => {
    setSkateMapStatus("loading");
    (async () => {
      try {
        const response = await fetch("/api/temp-skatemap");
        if (response.status !== 200) {
          throw new Error();
        }
        const data = await response.json();
        setSkateMap(data);
        setSkateMapStatus("loaded");
      } catch (e) {
        setSkateMapStatus("error");
      }
    })();
  }, []);

  return (
    <>
      <div className={styles.container}>
        {skateMapStatus === "loaded" ? (
          <ThreeCanvas className={styles.canvas} skateMap={skateMap} />
        ) : (
          <main className={styles.main}>
            {skateMapStatus === "loading" ? (
              <h1 className={styles.title}>Temporary skating</h1>
            ) : (
              <h1>{skateMapStatus}</h1>
            )}
          </main>
        )}
      </div>
      <Footer />
    </>
  );
};
export default TempSkate;
