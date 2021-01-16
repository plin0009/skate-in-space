import { NextApiHandler } from "next";
import { parseCookies, setCookie } from "nookies";

interface RefreshResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

const Refresh: NextApiHandler = async (req, res) => {
  const cookies = parseCookies({ req });

  if (!("refresh_token" in cookies)) {
    res.status(500);
    res.send("No refresh token.");
    return;
  }
  const refresh_token = cookies["refresh_token"];

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64")}`,
      },
      body,
    });
    const { access_token, expires_in }: RefreshResponse = await response.json();
    setCookie({ res }, "access_token", access_token, {
      path: "/",
      maxAge: expires_in,
    });
    res.status(200);
    res.send("Retrieved new access token");
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send("Error in using refresh token");
  }
};

export default Refresh;
