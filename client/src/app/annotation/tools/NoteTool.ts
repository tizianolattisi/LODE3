import {Tool, NewAnnotation} from './Tool';
import {AnnotationManager}from "../AnnotationManager";
import {NoteAnnotation} from "../model/NoteAnnotation";
import {BaseAnnotation} from "../model/BaseAnnotation";
import {Canvas as ICanvas, Group, Object as IObject} from "fabric";
declare const fabric: any;

import {Subject} from "rxjs/Subject";
import DeltaStatic = Quill.DeltaStatic;

const DEFAULT_PLACEHOLDER_CIRCLE_RADIUS = 20;

const ICON_PATH = 'M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z'
const SHADOW = {
  offsetX: 0,
  offsetY: 3,
  blur: 6,
  color: 'rgba(0,0,0,0.19)'
};

let am: AnnotationManager;
let eventEmitter: Subject<NewAnnotation>;


export class NoteTool implements Tool {

  public static TYPE = 'note';

  onAnnotationManagerProvided(annotationManager: AnnotationManager) {
    am = annotationManager;
  }

  toolSelected() {
    eventEmitter = new Subject<NewAnnotation>();
  };

  toolDeselected() {
    eventEmitter.complete();
    eventEmitter = null;
  };

  onDragStart = function (event: fabric.IEvent) {

  };

  onDragMove = function (event: fabric.IEvent) {

  };

  onDragStop = function (event: fabric.IEvent) {
    if (event.target && event.target.selectable) {
      return;
    }

    let point = (<ICanvas>this).getPointer(event.e);
    let noteGroup = NoteTool.drawNotePlaceholder(point.x, point.y, this);

    let noteAnnotation: NoteAnnotation = {
      x: point.x,
      y: point.y,
      title: '',
      text: {} as DeltaStatic
    };
    let pageNumber = parseInt((<ICanvas>this).getElement().getAttribute(AnnotationManager.CANVAS_PAGE_NUMBER));

    eventEmitter.next({
      pageNumber: pageNumber,
      annotationData: noteAnnotation,
      canvasAnnotation: noteGroup
    });

    am.terminateToolSession();
  };


  static drawNotePlaceholder(x: number, y: number, canvas: ICanvas): Group {
    if (!canvas) {
      return null;
    }

    let noteCircle = new fabric.Circle({
      radius: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      fill: 'white',
      shadow: <any>SHADOW
    });

    let noteIcon = new fabric.Path(ICON_PATH, {
      left: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      top: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      fill: '#F9A825',
      originX: 'center',
      originY: 'center'
    });

    let noteGroup = new fabric.Group([noteCircle, noteIcon], {
      left: x,
      top: y,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true
    });
    noteGroup.setControlsVisibility({
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

    canvas.add(noteGroup);
    return noteGroup;
  }


  getType() {
    return NoteTool.TYPE;
  };

  onAnnotationReady() {
    return eventEmitter.asObservable();
  }

  drawItem(annotation: BaseAnnotation): IObject {

    let data: NoteAnnotation = <NoteAnnotation>annotation.data;

    let noteCircle = new fabric.Circle({
      radius: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      fill: 'white',
      shadow: <any>SHADOW
    });

    let noteIcon = new fabric.Path(ICON_PATH, {
      left: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      top: DEFAULT_PLACEHOLDER_CIRCLE_RADIUS,
      fill: '#F9A825',
      originX: 'center',
      originY: 'center'
    });

    let g = new fabric.Group([noteCircle, noteIcon], {
      left: data.x,
      top: data.y,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true
    });
    g.setControlsVisibility({
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
    return g;
  };


  editItem(object: IObject, annotation: BaseAnnotation) {
    return annotation;
  }

  onScale(object: IObject): IObject {
    return object;
  }

}
