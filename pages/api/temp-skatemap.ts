import { NextApiHandler } from "next";
import data from "../../utils/tempSkatemap";
import getSkateMap from "../../utils/skatemap";

const TempSkateMap: NextApiHandler = (req, res) => {
  const skateMap = getSkateMap(data);

  res.json(skateMap);
};

export default TempSkateMap;
