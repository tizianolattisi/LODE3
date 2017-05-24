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

/**
 * Values used to scale the annotation properly when the whole pdf page is scaled.
 */
export interface AnnotationScales {
  origLeft: number, // Left coordinate of the annotation the first time it was drawn (Calculated respect to the pdf scale factor, see "origScaleX").
  origTop: number, // Top coordinate of the annotation the first time it was drawn (Calculated respect to the pdf scale factor, see "origScaleY").
  origScaleX: number, // Pdf scale factor (X axis) registered when the annotation has been drawn for the first time.
  origScaleY: number // Pdf scale factor (Y axis) registered when the annotation has been drawn for the first time.
}
