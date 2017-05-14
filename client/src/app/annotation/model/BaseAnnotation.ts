import {AnnotationData} from "./AnnotationData";

export interface BaseAnnotation {

  uuid: string,
  pdfId?: string,
  pageNumber: number,
  type: string,
  scales: AnnotationScales,
  data: AnnotationData,
  time?: number
  timestamp?: Date
}

export interface AnnotationScales {
  origLeft: number,
  origTop: number,
  origScaleX: number,
  origScaleY: number
}
