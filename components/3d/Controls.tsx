import { segmentInterval } from "../../utils/skatemap";
import { useFrame } from "react-three-fiber";

const Controls = () => {
  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.elapsedTime; // replace with position + (elapsedTime - oldPosition.elapsedTime)
    camera.position.z = elapsedTime / segmentInterval;
  });
  return null;
};

export default Controls;
