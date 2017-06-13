import {BaseAnnotation} from "./BaseAnnotation";
type Action = 'add' | 'edit' | 'delete';

export interface AnnotationAction {
  currentState: BaseAnnotation;
  prevState: BaseAnnotation;
  action: Action;
}
