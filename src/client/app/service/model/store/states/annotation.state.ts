export interface AnnotationState {
  annotations: {[slideId: string]: {[uuid: string]: any}}; // TODO type
  selectedAnnotations: string[];
  fetchedSlides: string[];
}
