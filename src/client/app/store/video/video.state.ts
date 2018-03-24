import { Annotation, DataType } from '../../service/model/annotation';

export enum Layout {
  NONE,
  LINEAR3,
  LINEAR2,
  TABULAR3,
  TABULAR2
}

export interface VideoState {
  camUrl: string;
  pcUrl: string;

  totalTime: number;
  currentTime: number;
  updatedTime: number;
  playing: boolean;
  speed: number;
  volume: boolean;
  videoLayout: Layout;

  startTimestamp: number;
  hasAnnotations: boolean;
  allAnnotations: Map<string, Annotation<DataType>[]>
}
