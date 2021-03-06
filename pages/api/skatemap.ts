import { NextApiHandler } from "next";
import getAccessToken from "../../utils/api/accessToken";
import getSkateMap from "../../utils/skatemap";

const Skatemap: NextApiHandler = async (req, res) => {
  const accessToken = await getAccessToken(req, res);
  if (accessToken === null) {
    return;
  }

  const id = req.query.id;

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  };

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${id}`,
      { headers }
    );
    if (response.status === 200) {
      // cool
      const audioAnalysis = await response.json();
      res.status(200);

      const skateMap = getSkateMap(audioAnalysis);
      res.json(skateMap);

      return;
    } else {
      console.log("couldn't get audio analysis");
      console.log(await response.text());
      throw new Error();
    }
  } catch (e) {
    res.status(500);
    res.send(":(");
    return;
  }
};

export default Skatemap;
