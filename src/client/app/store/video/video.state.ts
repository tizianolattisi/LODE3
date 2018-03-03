export interface VideoState {
  camUrl: string;
  pcUrl: string;
  camVideo: HTMLVideoElement;
  pcVideo: HTMLVideoElement;

  totalTime: number;
  currentTime: number;
  playing: boolean;
  speed: number;
  volume: boolean;
}
