import {AnnotationDataDraw} from "./AnnotationDataDraw";

export interface PencilAnnotation extends AnnotationDataDraw {
  x: number,
  y: number,
  paths: any[]
}
