import { NextApiHandler } from "next";
import getAccessToken from "../../utils/api/accessToken";

const StartTrack: NextApiHandler = async (req, res) => {
  const accessToken = await getAccessToken(req, res);
  if (accessToken === null) {
    return;
  }

  const { albumUri, trackNumber, deviceId } = req.query;

  const headers = {
    Authorization: "Bearer " + accessToken,
  };

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          context_uri: albumUri,
          offset: {
            position: +trackNumber - 1,
          },
          position_ms: 0,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    res.status(200);
    res.send("👍");
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send("I'm so tired");
  }
};

export default StartTrack;
