import { useEffect, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { SkateMap } from "../../utils/skatemap";
import SkateMapPlane from "./SkateMapPlane";
import Cube from "./Cube";

import * as CANNON from "cannon-es";
import Controls from "./Controls";

interface ThreeCanvasProps {
  className: string;
  skateMap: SkateMap;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = (props) => {
  const { skateMap } = props;
  const { world } = useMemo(() => {
    const world = new CANNON.World();
    world.gravity.set(0, -10, 0);
    return { world };
  }, []);

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      world.step(1 / 60);
    };
    animate();
  }, []);

  return (
    <Canvas
      concurrent
      gl={{ antialias: false }}
      camera={{ position: [0, 2.5, -5], far: 40 }}
      {...props}
      shadowMap
    >
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <pointLight castShadow position={[0, 2, -3]} intensity={0.5} />
      <SkateMapPlane data={skateMap} world={world} />
      {
        //<Cube world={world} />
      }

      <Controls />
    </Canvas>
  );
};
export default ThreeCanvas;
