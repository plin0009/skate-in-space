import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";

const getAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = parseCookies({ req });

  let accessToken: string;
  if (!("access_token" in cookies)) {
    if (!("refresh_token" in cookies)) {
      res.status(403);
      res.send("No tokens");
      return null;
    }
    const refreshResponse = await fetch("/api/refresh");

    if (refreshResponse.status !== 200) {
      res.status(403);
      res.send("Could not use refresh token");
      return null;
    }
    const data = await refreshResponse.json();
    accessToken = data.access_token;
  } else {
    accessToken = cookies.access_token;
  }

  return accessToken;
};

export default getAccessToken;
