export const getDisplayDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = seconds % 60;
  return `${minutes}:${secondsRemainder < 10 ? "0" : ""}${secondsRemainder}`;
};
