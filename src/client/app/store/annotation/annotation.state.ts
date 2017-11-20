import {Annotation, DataType} from '../../service/model/annotation';

export interface AnnotationState {

  annotations: {[slideId: string]: {[uuid: string]: Annotation<DataType>}};
  selectedAnnotations: string[];
  fetchedSlides: string[];
}
