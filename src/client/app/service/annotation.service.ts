import {Annotation} from './model/annotation';
import {WsFromClientEvents} from './model/ws-msg';
import {Injectable} from '@angular/core';
import {SocketService} from './socket.service';
import {AnnotationSearch} from './model/annotation-search';


@Injectable()
export class AnnotationService {

  constructor(private socketService: SocketService) {
  }

  fetchAnnotations(search: AnnotationSearch) {
    this.socketService.send(WsFromClientEvents.ANNOTATION_GET, search);
  }

  addAnnotation(annotation: Annotation) {
    this.socketService.send(WsFromClientEvents.ANNOTATION_ADD, annotation);
  }

  editAnnotation(annotation: Annotation) {
    this.socketService.send(WsFromClientEvents.ANNOTATION_EDIT, annotation);
  }

  deleteAnnotation(annotationId: {uuid: string; lectureId: string}) {
    this.socketService.send(WsFromClientEvents.ANNOTATION_DELETE, annotationId);
  }

}
