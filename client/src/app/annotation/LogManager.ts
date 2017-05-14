import {BaseAnnotation} from "./model/BaseAnnotation";
import {Injectable} from "@angular/core";
import {AnnotationManager} from "./AnnotationManager";
import {LogAnnotation} from "./model/LogAnnotation";

@Injectable()
export class LogManager {

  constructor(private annotationManager: AnnotationManager) {
  }

  newLog(type: string, subtype: string, value: number): BaseAnnotation {

    // Create log data
    let log: LogAnnotation = {
      type: type,
      action: subtype,
      value: value
    };

    // Add new log annotation using annotation manager
    return this.annotationManager.addNewAnnotation('log', 1, {
      pageNumber: 1,
      annotationData: log,
      canvasAnnotation: null,
    });
  }
}
