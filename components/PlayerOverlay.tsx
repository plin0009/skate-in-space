import { TrackObject } from "../pages/api/skateability";
import { PlayerState } from "../pages/skate";
import { getDisplayDuration } from "../utils/track";

interface PlayerOverlayProps {
  className?: string;
  playerState: PlayerState;
  chosenTrack: TrackObject;
}

const PlayerOverlay: React.FC<PlayerOverlayProps> = ({
  className,
  playerState,
  chosenTrack,
}) => {
  if (playerState === null) {
    return <div className={className}></div>;
  }
  return (
    <div className={className}>
      <p>
        {chosenTrack.name} -{" "}
        {chosenTrack.artists.map((artist) => artist.name).join(", ")}
      </p>
    </div>
  );
};

export default PlayerOverlay;
