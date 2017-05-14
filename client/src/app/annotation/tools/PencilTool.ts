import {Tool, NewAnnotation} from './Tool';
import {AnnotationManager} from "../AnnotationManager";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {PencilAnnotation} from "../model/PencilAnnotation";
import {Subject} from "rxjs/Subject";
import {Canvas as ICanvas, Group, IPath, Object as IObject} from "fabric";

declare const fabric: any;

let am: AnnotationManager;
let eventEmitter: Subject<NewAnnotation>;

let annotationsPerPageMap: { [page: number]: NewAnnotation } = {}; // items drawn while the tool was selected. one group for each page (index == page)

let pathCreatedCallback = function (obj: any) {

  let path: IPath = obj.path;
  let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));

  let newAnnotation: NewAnnotation = annotationsPerPageMap[pageNumber];
  (<PencilAnnotation>newAnnotation.annotationData).paths.push(path.toJSON());
  // path.set(AnnotationManager.PATH_N, (<any>newAnnotation.canvasAnnotation).length);
  path.set('lockMovementX', true);
  path.set('lockMovementY', true);
  path.set('lockRotation', true);
  path.set('lockScalingX', true);
  path.set('lockScalingY', true);
  path.set('lockUniScaling', true);
  path.setControlsVisibility({
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mt: false,
    mb: false,
    mr: false,
    ml: false,
    mtr: false
  });
  path.set('selectable', true);

  path.remove();
  (newAnnotation.canvasAnnotation as Group).addWithUpdate(path);
  (<PencilAnnotation>newAnnotation.annotationData).x = newAnnotation.canvasAnnotation.getLeft();
  (<PencilAnnotation>newAnnotation.annotationData).y = newAnnotation.canvasAnnotation.getTop();
  this.renderAll();
};


export class PencilTool implements Tool {

  public static TYPE = 'pencil';

  onAnnotationManagerProvided(annotationManager: AnnotationManager) {
    am = annotationManager;
  }

  toolSelected() {
    annotationsPerPageMap = {};
    eventEmitter = new Subject<NewAnnotation>();
  };

  toolDeselected() {

    for (let i in annotationsPerPageMap) {
      if (annotationsPerPageMap.hasOwnProperty(i)) {
        eventEmitter.next(annotationsPerPageMap[i]);
      }
    }

    eventEmitter.complete();
    eventEmitter = null;
  };

  onDragStart = function (event: fabric.IEvent) {
    // drawing mode activated from AnnotationManager
    (<ICanvas>this).on('path:created', pathCreatedCallback);
    // create new annotation
    let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));
    let newAnnotation: NewAnnotation = annotationsPerPageMap[pageNumber];
    if (!newAnnotation) {
      newAnnotation = <any>{
        pageNumber: pageNumber,
        annotationData: <PencilAnnotation>{
          angle: 0,
          paths: [],
          stroke: this.freeDrawingBrush.color,
          strokeWidth: this.freeDrawingBrush.width
        },
        canvasAnnotation: new fabric.Group([], {
          subTargetCheck: true
        })
      };
      (this as ICanvas).add(newAnnotation.canvasAnnotation as Group);
      annotationsPerPageMap[pageNumber] = newAnnotation;
    }
  };

  onDragMove = function (event: fabric.IEvent) {
  };

  onDragStop = function (event: fabric.IEvent) {
    (<ICanvas>this).off('path:created', pathCreatedCallback);
  };


  getType() {
    return PencilTool.TYPE;
  };

  onAnnotationReady() {
    return eventEmitter.asObservable();
  }


  drawItem(annotation: BaseAnnotation): IObject {

    let data: PencilAnnotation = <PencilAnnotation>annotation.data;
    let paths: IObject[] = [];

    for (let i in data.paths) {
      let p = data.paths[i];
      if (p) {
        let path: IObject = (<any>fabric).Path.fromObject(p);
        path.set(AnnotationManager.PATH_N, i);
        path.set('lockMovementX', true);
        path.set('lockMovementY', true);
        path.set('lockRotation', true);
        path.set('lockScalingX', true);
        path.set('lockScalingY', true);
        path.set('lockUniScaling', true);
        path.setControlsVisibility({
          bl: false,
          br: false,
          tl: false,
          tr: false,
          mt: false,
          mb: false,
          mr: false,
          ml: false,
          mtr: false
        });
        path.set('selectable', true);
        paths.push(path);
      }
    }
    return new fabric.Group(paths, {
      left: data.x,
      top: data.y,
      subTargetCheck: true
    });
  };

  editItem(object: IObject, annotation: BaseAnnotation): BaseAnnotation {
    return annotation;
  }

  onScale(object: IObject): IObject {
    // Correct strokeWidth modified by the scale
    (<IPath>object).strokeWidth = ((<IPath>object).strokeWidth / object.getScaleX()) * am.getScaleValue();
    return object;
  }

}
