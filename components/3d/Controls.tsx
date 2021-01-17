import { useFrame } from "react-three-fiber";

const Controls = () => {
  useFrame(({ camera }) => {
    camera.position.z += 0.06;
  });
  return null;
};

export default Controls;
