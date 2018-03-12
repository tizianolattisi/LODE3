export interface VideoState {
  camUrl: string;
  pcUrl: string;
  pcVideo: HTMLVideoElement;

  totalTime: number;
  updatedTime: number;
  playing: boolean;
  speed: number;
  volume: boolean;
  videoLayout: string;

  startTimestamp: number;
  hasAnnotations: boolean;
}
