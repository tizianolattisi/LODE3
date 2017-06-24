import {Annotation} from '../../service/model/annotation';

export interface AnnotationState {

  annotations: {[slideId: string]: {[uuid: string]: Annotation}};
  selectedAnnotations: string[];
  fetchedSlides: string[];
}
