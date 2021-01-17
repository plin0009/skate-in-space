import { segmentInterval } from "../../utils/skatemap";
import { useFrame } from "react-three-fiber";
import { PlayerState } from "../../pages/skate";

interface ControlsProps {
  playerState: PlayerState;
  testing?: boolean;
}

const Controls: React.FC<ControlsProps> = ({ playerState, testing }) => {
  useFrame(({ clock, camera }) => {
    if (testing) {
      const elapsedTime = clock.elapsedTime;
      camera.position.z = elapsedTime / segmentInterval;
      return;
    }
    if (playerState === null || playerState.paused) {
      return;
    }

    const time = new Date().getTime();
    const elapsedTime =
      (time - playerState.positionTime + playerState.position) / 1000;
    camera.position.z = elapsedTime / segmentInterval;
  });
  return null;
};

export default Controls;
