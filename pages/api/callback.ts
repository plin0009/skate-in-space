import { NextApiHandler } from "next";
import { setCookie } from "nookies";

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

const Callback: NextApiHandler = async (req, res) => {
  if ("error" in req.query) {
    res.status(500);
    res.send(req.query.error);
    return;
  }
  if (!("code" in req.query)) {
    res.status(500);
    res.send("No code");
    return;
  }
  // todo: check for state mismatch by cookies

  const code = req.query.code as string;
  const host =
    process.env.NODE_ENV === "production"
      ? "https://skatein.space"
      : `http://localhost:3000`;
  const redirectUri = `${host}/api/callback`;
  const body = new URLSearchParams({
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
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
    if (response.status !== 200) {
      console.log(response.status);
      const data = await response.text();
      console.log(data);
      res.status(500);
      res.send("invalid response :(");
      return;
    }
    const data: TokenResponse = await response.json();

    // store tokens in cookies
    setCookie({ res }, "access_token", data.access_token, {
      path: "/",
      maxAge: data.expires_in,
    });
    // todo: actually use refresh token
    setCookie({ res }, "refresh_token", data.refresh_token, {
      path: "/",
    });

    // redirect to main page
    res.redirect("/skate");
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send("Error in getting token");
  }
};

export default Callback;
