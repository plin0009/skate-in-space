import { segmentInterval } from "../../utils/skatemap";
import { useFrame, useUpdate } from "react-three-fiber";
import { PlayerState } from "../../pages/skate";
import * as CANNON from "cannon-es";
import { BoxBufferGeometry, Mesh } from "three";

interface ControlsProps {
  playerState: PlayerState;
  testing?: boolean;
  world: CANNON.World;
}

const Controls: React.FC<ControlsProps> = ({ playerState, testing }) => {
  useFrame(({ clock, camera }) => {
    let elapsedTime: number;

    if (testing) {
      elapsedTime = clock.elapsedTime;
    } else {
      if (playerState === null || playerState.paused) {
        return;
      } else {
        const time = new Date().getTime();
        elapsedTime =
          (time - playerState.positionTime + playerState.position) / 1000;
      }
    }
    const zVal = elapsedTime / segmentInterval;
    const xVal = -2 * Math.sin(zVal / 30) * 4;
    camera.position.z = zVal;
    camera.position.x = xVal;
    if (skateboard.current) {
      skateboard.current.position.z = zVal;
      skateboard.current.position.x = xVal * 1.01;
      skateboard.current.rotation.y = xVal / 25;
      skateboard.current.rotation.z = xVal / 20;
    }
  });

  const skateboard = useUpdate<Mesh<BoxBufferGeometry>>(
    ({ position, rotation }) => {
      position.set(-0.35, 1.5, 2);
      rotation.set(0, 0, 0);
    },
    []
  );
  return (
    <mesh ref={skateboard}>
      <boxBufferGeometry attach="geometry" args={[0.5, 0.05, 2]} />
      <meshBasicMaterial attach="material" color="#cfa" />
    </mesh>
  );
};

export default Controls;
