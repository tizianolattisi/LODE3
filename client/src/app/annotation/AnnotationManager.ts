import {Storage, StorageOperation, StorageOpType} from "./storage/Storage";
import {ToolAndUI} from "./utils/ToolAndUI";
import {Tool, NewAnnotation} from "./tools/Tool";
import {HighlightTool} from "./tools/HighlightTool";
import {AnnotationScales, BaseAnnotation} from "./model/BaseAnnotation";
import {Injectable, Inject} from "@angular/core";
import {NoteTool} from "./tools/NoteTool";
import {generateUUID, STORAGE_TOKEN} from "./utils/Utils";
import {PencilTool} from "./tools/PencilTool";
import {PencilAnnotation} from "./model/PencilAnnotation";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {StoreService} from "../shared/store.service";
import {Router} from "@angular/router";
import {
  StaticCanvas as IStaticCanvas,
  Canvas as ICanvas,
  Object as IObject,
  IEvent as IEvent,
  Group as IGroup
} from "fabric";
import {ToolService} from "./tool.service";
import DeltaStatic = Quill.DeltaStatic;
import * as moment from "../../../../bin/node_modules/moment/moment";
import Base = moment.unitOfTime.Base;
import {OpenNotes} from "./OpenNotes";
import 'uikit';
import {AnnotationAction} from "./model/AnnotationAction";

declare const fabric: any;

/**
 * Object responsible of all the annotations stuff on the PDF document
 * It initialize also the Annotation toolbar
 */
@Injectable()
export class AnnotationManager {

  static DEFAULT_TOOL_TYPE: string = 'default';

  static CANVAS_PAGE_NUMBER = 'data-page-number';
  static ELEM_UUID = 'uuid';
  static ELEM_PAGE = 'page';
  static ELEM_TYPE = 'elemType';
  static PATH_N = 'path-n';

  // ///////////////
  // Variables
  // //////////////

  // Base
  protected pdfViewer: any;
  documentId: string;

  protected canvases: ICanvas[] = [];
  protected currentCanvas: IStaticCanvas = null;

  protected _allAnnotations$: BehaviorSubject<{ [uuid: string]: BaseAnnotation }[]> = new BehaviorSubject([]);
  protected allAnnotations$: Observable<{ [uuid: string]: BaseAnnotation }[]> = this._allAnnotations$.asObservable();

  protected annotationsObjects: { [uuid: string]: IObject } = {};

  // Tools
  protected _annotationTools$: BehaviorSubject<{ [type: string]: ToolAndUI }> = new BehaviorSubject({} as { [type: string]: ToolAndUI });
  annotationTools$: Observable<{ [type: string]: ToolAndUI }> = this._annotationTools$.asObservable();

  protected _toolSelected$: BehaviorSubject<string> = new BehaviorSubject(AnnotationManager.DEFAULT_TOOL_TYPE);
  toolSelected$: Observable<string> = this._toolSelected$.asObservable();

  // Listen from new annotations coming from tools
  private onNewAnnotationFromTool: Observable<NewAnnotation>;

  // Utils
  public isEditorMode: boolean = true;
  protected allAnnotationsLoaded: boolean = false;
  protected videoStartDate: Date = null;

  // Annotation Properties
  public currentColor: string = "#212121";
  public currentStrokeWidth: number = 3;
  public isTextSelectionMode: boolean = false;

  // Stacks where actions (add, edit, delete) performed by the user are collected.
  // Each action is saved into the undoHistory. When user performs an undo, actions are popped from
  // the undoHistory and pushed into the redoHistory and vice versa.
  private undoHistory: AnnotationAction[] = [];
  private redoHistory: AnnotationAction[] = [];

  // ///////////////////////////
  // Constructor
  // ///////////////////////////

  constructor(private toolService: ToolService,
              private openNotes: OpenNotes,
              @Inject(STORAGE_TOKEN) private storage: Storage,
              private storeService: StoreService,
              private router: Router) {

    // set editor mode
    this.router.events.subscribe(() => {
      if (this.router.url == '/editor') {
        this.isEditorMode = true;
        this.currentCanvas = null;
        this.pdfViewer.currentScaleValue = '1';
        this.pdfViewer.currentScaleValue = 'Auto';
      } else if (this.router.url == '/video') {
        this.isEditorMode = false;
        this.canvases = [];
        if (!this.allAnnotationsLoaded && this.videoStartDate) {
          this.loadAllAnnotations();
        }
      }
    });

    this.init();
    this.initTools();
    this.initFabric();
    this.initStorage();

    this.storeService.lodeLecture.subscribe(lodeLecture => { // load all annotations
      if (lodeLecture) {
        this.videoStartDate = lodeLecture.video.start;
        if (!this.isEditorMode && !this.allAnnotationsLoaded) {
          this.loadAllAnnotations();
        }
      }
    });
  }

  private loadAllAnnotations() {
    this._allAnnotations$.next([]); // remove previous annotations that will be reloaded
    this.storage.getAnnotations(this.storeService.pdfHash, this.videoStartDate);
    this.allAnnotationsLoaded = true;
  }


  // ///////////////////////////
  // Initialization Functions
  // ///////////////////////////

  protected init() {
    this.storeService.pdfViewer.subscribe(pdfViewer => {
      if (pdfViewer) {
        this.pdfViewer = pdfViewer;
        /*
         * Listen for page rendering and add the annotation svg layer.
         * Event 'pagerendered' is fired from PDFViewer when a new page is rendered
         * or the scale is changed (in this case, each page is rendered again)
         */
        pdfViewer.container.addEventListener('pagerendered', (e: any) => {
          const container = e.detail.canvas ? e.detail.canvas : e.target;
          this.createAnnotationCanvas(container, e.detail.pageNumber, this.isEditorMode);
        });

        this.documentId = this.storeService.pdfHash;

        this.canvases = [];
        this.currentCanvas = null;
      }
    });
  }

  /**
   * Setup the available tools.
   */
  protected initTools() {
    let annotationsTools = this.toolService.getTools();
    // Initialize the annotation tools and the related user interface
    for (let key of Object.keys(annotationsTools)) {
      annotationsTools[key].tool.onAnnotationManagerProvided(this);
    }
    this._annotationTools$.next(annotationsTools);
  }

  /**
   * Setup some FabricJS canvas properties.
   */
  protected initFabric() {
    // customize annotations editing handlers
    fabric.Object.prototype.borderColor = 'rgb(5, 168, 255)';
    fabric.Object.prototype.cornerColor = 'rgb(5, 168, 255)';
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.rotatingPointOffset = 20;
    fabric.Object.prototype.padding = 2;
  }

  /**
   * Initialize the storage and start listening for storage events.
   */
  private initStorage() {
    let storageEmitter = this.storage.onEvent();
    if (storageEmitter) {
      storageEmitter.subscribe((res: StorageOperation) => {
        switch (res.operation) {

          case StorageOpType.get:
            for (let ann of res.annotations) {
              this.addToAllAnnotations(ann);
              this.renderAnnotationToCanvas(this.canvases[ann.pageNumber], ann);
            }
            break;
          case StorageOpType.addFail:
            if (res.annotations[0]) {
              this.deleteAnnotation(res.annotations[0].uuid, res.annotations[0].pageNumber, true);
            }
            AnnotationManager.showTempErrMessage('Fail to save the last annotation. Please, try to refresh the page.');
            break;
          case StorageOpType.deleteFail:
            AnnotationManager.showTempErrMessage('Fail to delete the last annotation. Please, try to refresh the page.');
            break;
          case StorageOpType.editFail:
            if (res.annotations[0]) {
              this.deleteAnnotation(res.annotations[0].uuid, res.annotations[0].pageNumber, true);
              let pageNumber = res.annotations[0].pageNumber;
              this.renderAnnotationToCanvas(this.canvases[pageNumber], res.annotations[0]);
            }
            AnnotationManager.showTempErrMessage('Fail to save last edited annotation. Please, try to refresh the page.');
            break;
          case StorageOpType.close:
            AnnotationManager.showTempErrMessage('Attention! It\'s possible that future annotations will not be saved. Please, try to refresh the page.');
            break;
        }
      });
    }
  }

  // ///////////////////////////
  // Canvas
  // ///////////////////////////

  /**
   * Substitute the canvas content created by PDFViewer with a readonly/editable canvas of FabricJS.
   * If the canvas has already been substituted (thus some annotations are already been drawn
   * because pdf page is not new but only re-rendered), re-add the the editable canvas and reload the annotations.
   * @param container canvas container
   * @param pageNumber page number
   * @param editable is editable canvas
   */
  protected createAnnotationCanvas(container: HTMLElement, pageNumber: number, editable: boolean) {

    // Add a new canvas on top of PdfJS canvas
    let c = document.createElement('canvas');
    container.appendChild(c);

    let fCanvas = (editable) ? new fabric.Canvas(c) : new fabric.StaticCanvas(c);
    fCanvas.getElement().setAttribute(AnnotationManager.CANVAS_PAGE_NUMBER, pageNumber.toString());

    fCanvas.setWidth(container.getBoundingClientRect().width);
    fCanvas.setHeight(container.getBoundingClientRect().height);
    this.scaleCanvasObjects(fCanvas);

    this.canvases[pageNumber] = fCanvas;
    if (editable) {
      this.updateCanvasForTool(<ICanvas>fCanvas, this._toolSelected$.getValue());
      this.setCanvasObjectSelectHandler(<ICanvas>fCanvas);
      this.setCanvasObjectEditHandler(<ICanvas>fCanvas);
    }

    // Load annotations
    this.drawAnnotationsToCanvas(pageNumber);
    return fCanvas;
  }

  /**
   * Draw annotations to canvas if they has been previously loaded or load them.
   * @param pageNumber
   */
  protected drawAnnotationsToCanvas(pageNumber: number) {
    let annotationsPerPage = this._allAnnotations$.getValue()[pageNumber];

    if (annotationsPerPage) { // Annotations already loaded from storage -> Render them
      for (let annUuid in annotationsPerPage) {
        this.renderAnnotationToCanvas(this.canvases[pageNumber], annotationsPerPage[annUuid]);
      }
    } else {
      if (this.isEditorMode) { // Annotations not yet loaded -> Fetch from storage
        this.storage.getAnnotations(this.documentId, null, pageNumber);
      }
    }
  }

  /**
   * Render an annotation to a canvas, apply scales and add metadata to the rendered annotation.
   * @param canvas canvas where render the annotation
   * @param annotation annotation data representing the annotation to render
   * @return {IObject} Canvas Object
   */
  protected renderAnnotationToCanvas(canvas: ICanvas, annotation: BaseAnnotation) {
    let canvasObject = this.renderAnnotationToCanvasSimple(canvas, annotation);

    if (canvasObject) {
      this.addAttrsToCanvasObject(canvasObject, annotation.uuid, annotation.type, annotation.pageNumber);

      // Copy scale parameters from annotation data to canvas objects
      let scales = annotation.scales;
      (canvasObject as any).origLeft = scales.origLeft;
      (canvasObject as any).origTop = scales.origTop;
      (canvasObject as any).origScaleX = scales.origScaleX;
      (canvasObject as any).origScaleY = scales.origScaleY;

      this.scaleCanvasObjects(canvas);

      // Save object to array
      this.annotationsObjects[annotation.uuid] = canvasObject;
    }
    return canvasObject;
  }

  /**
   * Render an annotation to a canvas.
   * @param canvas canvas where render the annotation
   * @param annotation annotation data representing the annotation to render
   * @return {IObject} Canvas Object
   */
  protected renderAnnotationToCanvasSimple(canvas: ICanvas, annotation: BaseAnnotation) {
    let tool = this._annotationTools$.getValue()[annotation.type];
    if (tool && canvas) {
      let canvasObject = tool.tool.drawItem(annotation);
      if (canvasObject) {
        canvas.add(canvasObject);
      }
      return canvasObject;
    }
  }

  // ///////////////////////////
  //  Annotations management
  // ///////////////////////////

  /**
   * Add a new annotation to the storage.
   * @param type Type of annotation.
   * @param pageNumber Page number.
   * @param newAnnotation New annotation representation (canvas object + annotation data).
   * @param uuid optional uuid to assign to the annotation. If not provided,, a random uuid will be used.
   * @param notChangeHistory override the default behaviour of the method avoiding to save the add action
   * into the undo history.
   * @return New annotation.
   */
  addNewAnnotation(type: string, pageNumber: number, newAnnotation: NewAnnotation, uuid?: string, notChangeHistory?: boolean): BaseAnnotation {
    let annotationUuid = uuid ? uuid : generateUUID();
    let canvasObject = newAnnotation.canvasAnnotation;
    let data = newAnnotation.annotationData;
    let scales: AnnotationScales = newAnnotation.scales || null;

    if (canvasObject) {
      // Set canvas object properties
      this.addAttrsToCanvasObject(canvasObject, annotationUuid, type, pageNumber);

      (canvasObject as any).origLeft = canvasObject.getLeft();
      (canvasObject as any).origTop = canvasObject.getTop();
      (canvasObject as any).origScaleX = this.getScaleValue();
      (canvasObject as any).origScaleY = this.getScaleValue();
      scales = {
        origLeft: canvasObject.getLeft(),
        origTop: canvasObject.getTop(),
        origScaleX: this.getScaleValue(),
        origScaleY: this.getScaleValue()
      };

    }

    // Build a new annotation
    let annotation: BaseAnnotation = {
      uuid: annotationUuid,
      type: type,
      pageNumber: pageNumber,
      scales: scales,
      data: data
    };

    // If available, add the video time
    let time = this.storeService.getCurrentTime();
    if (time && time > 0 && this.videoStartDate) {
      annotation.timestamp = AnnotationManager.getVideoDateRelativeToLesson(time, this.videoStartDate);
    }

    // Save in storage
    this.storage.addAnnotation(this.documentId, annotation);

    // Add time relative to video
    if (time && time > 0) {
      annotation.time = time;
    }

    // Add to objects var
    this.annotationsObjects[annotationUuid] = canvasObject;

    // Add annotation to allAnnotations
    this.addToAllAnnotations(annotation);

    if (!notChangeHistory) {
      this.addToUndoHistory({currentState: annotation, prevState: null, action: 'add'});
    }

    return annotation;
  }

  /**
   * Delete an annotation from the storage and the canvas.
   * @param uuid Annotation id.
   * @param pageNumber Page number.
   * @param notSave true if want not to delete the annotation from storage (= remove only from canvas)
   * @param notChangeHistory override the default behaviour of the method avoiding to save the delete action
   * into the undo history.
   */
  deleteAnnotation(uuid: string, pageNumber: number, notSave?: boolean, notChangeHistory?: boolean) {
    // remove from canvas
    let object = this.annotationsObjects[uuid];
    let canvas = this.canvases[pageNumber];

    if (object && canvas) {
      canvas.remove(object);
    }
    // delete in storage
    if (!notSave) {
      this.storage.deleteAnnotation(this.documentId, uuid);
    }
    // remove from all annotations var
    let annInPage = this._allAnnotations$.getValue()[pageNumber];
    if (annInPage) {
      let ann = Object.assign({}, annInPage[uuid]);
      delete annInPage[uuid];
      let temp = {};
      temp[pageNumber] = annInPage;
      this._allAnnotations$.next(Object.assign([], this._allAnnotations$.getValue(), temp));

      if (!notChangeHistory) {
        this.addToUndoHistory({currentState: null, prevState: ann, action: 'delete'});
      }
    }
  }

  private doEditAnnotation(annotation: BaseAnnotation, object: IObject, notChangeHistory?: boolean) {
    // let oldAnn = Object.assign({}, annotation);
    let oldAnn = {...annotation, scales: {...annotation.scales}, data: {...annotation.data}};

    // Edit canvas object
    let tool = this.getTool(annotation.type);
    if (tool) {
      let editedAnn = tool.editItem(object as IObject, annotation);

      // Edit scales
      if (object) {
        let newOrigScaleX = (this.getScaleValue() / object.getScaleX());
        let newOrigScaleY = (this.getScaleValue() / object.getScaleY());

        let newOrigLeft = ((object.getLeft() * newOrigScaleX) / this.getScaleValue());
        let newOrigTop = ((object.getTop() * newOrigScaleY) / this.getScaleValue());

        (object as any).origLeft = newOrigLeft;
        (object as any).origTop = newOrigTop;
        (object as any).origScaleX = newOrigScaleX;
        (object as any).origScaleY = newOrigScaleY;

        editedAnn.scales = {
          origLeft: newOrigLeft,
          origTop: newOrigTop,
          origScaleX: newOrigScaleX,
          origScaleY: newOrigScaleY
        };

        // Save canvas object in var
        this.annotationsObjects[annotation.uuid] = object;
        let canvas = this.canvases[annotation.pageNumber];
        if (canvas) {
          canvas.renderAll();
        }
      }
      // Edit in storage
      this.storage.editAnnotation(this.documentId, editedAnn);
      // Update all annotations var
      this.addToAllAnnotations(annotation);
      if (!notChangeHistory) {
        let newAnn = {...annotation, scales: {...annotation.scales}, data: {...annotation.data}};
        this.addToUndoHistory({currentState: newAnn, prevState: oldAnn, action: 'edit'});
      }
    }
  }

  /**
   * Save an edited annotation.
   * @param annotation Edited annotation.
   * @param notChangeHistory override the default behaviour of the method avoiding to save the edit action
   * into the undo history.
   */
  editAnnotation(annotation: BaseAnnotation, notChangeHistory?: boolean) {
    if (annotation) {
      let object = this.annotationsObjects[annotation.uuid];
      this.doEditAnnotation(annotation, object, notChangeHistory);
    }
  }

  /**
   * Edit a canvas annotation.
   * @param object New canvas object representing the annotation.
   * @param notChangeHistory override the default behaviour of the method avoiding to save the edit action
   * into the undo history.
   */
  private editCanvasAnnotation(object: IObject, notChangeHistory?: boolean) {

    // Fetch properties
    let uuid = object.get(AnnotationManager.ELEM_UUID);
    let pageNumber = object.get(AnnotationManager.ELEM_PAGE);

    if (uuid && pageNumber) {
      // Find the annotation
      let annInPage = this._allAnnotations$.getValue()[pageNumber];
      if (annInPage) {
        let annotation = annInPage[uuid];
        if (annotation) {
          this.doEditAnnotation(annotation, object, notChangeHistory);
        }
      }
    }
  }

  /**
   * Get all the available annotations as an Observable.
   * @return Observable of {[uuid: string]: BaseAnnotation}[].
   */
  getAnnotations(): Observable<{ [uuid: string]: BaseAnnotation }[]> {
    return this.allAnnotations$;
  }

  getAnnotation(uuid: string, pageNumber: number): BaseAnnotation {
    let anns = this._allAnnotations$.getValue();
    let annInPage = anns[pageNumber];
    return (annInPage) ? annInPage[uuid] : null;
  }

  private addAttrsToCanvasObject(object: IObject, uuid: string, type: string, pageNumber: number) {
    // Attach to a canvas object some attributes.

    object.set(AnnotationManager.ELEM_UUID, uuid);
    object.set(AnnotationManager.ELEM_PAGE, pageNumber);
    object.set(AnnotationManager.ELEM_TYPE, type);

    // Open the note on click on canvas
    if (type == NoteTool.TYPE) {
      (<IObject>object).on('mouseup', () => {
        this.openNotes.openNote(uuid, pageNumber, true);
      });
    }
  }

  // ///////////////////////////
  //  Tool Management
  // ///////////////////////////

  /**
   * Select a new tool to use.
   * @param type Tool type.
   */
  selectTool(type: string) {
    // Check if tool exists
    if (this._toolSelected$.getValue() == type) {
      return;
    }

    // Disable canvas drawing mode if previous tool was pencil
    if (this._toolSelected$.getValue() == PencilTool.TYPE) {
      for (let c of  this.canvases) {
        if (c) {
          c.isDrawingMode = false;
        }
      }
    }

    // Deselect previous tool
    let tool = this.getTool(this._toolSelected$.getValue());
    if (tool) {
      tool.toolDeselected();
    }
    if (this.onNewAnnotationFromTool) {
      this.onNewAnnotationFromTool = null;
    }

    // Select new tool
    let oldTool = this._toolSelected$.getValue();
    this._toolSelected$.next(type);

    tool = this.getTool(this._toolSelected$.getValue());
    if (tool) {
      tool.toolSelected();
      this.onNewAnnotationFromTool = tool.onAnnotationReady();
      if (this.onNewAnnotationFromTool) {
        // Save annotations that will be created by new selected tool
        this.onNewAnnotationFromTool.subscribe(newAnnotation => {
          this.addNewAnnotation(this._toolSelected$.getValue(), newAnnotation.pageNumber, newAnnotation);
        });
      }

      this.isTextSelectionMode = (type == HighlightTool.TYPE); // True if highlight tool is selected

      // Prepare canvases for new tool
      for (let canvas of this.canvases) {
        if (canvas) {
          this.resetToolLayer(canvas, oldTool);
          this.updateCanvasForTool(canvas, this._toolSelected$.getValue());
        }
      }
    } else if (this._toolSelected$.getValue() == AnnotationManager.DEFAULT_TOOL_TYPE) {
      for (let canvas of this.canvases) {
        if (canvas) {
          this.resetToolLayer(canvas, oldTool);
        }
      }
    }
  };

  /**
   * Perform some modification when tool is deselected
   * @param canvas Canvas
   * @param toolType Type of deselected tool.
   */
  protected resetToolLayer(canvas: ICanvas, toolType: string) {
    let tool = this.getTool(toolType);
    if (tool != null) {
      if (toolType == HighlightTool.TYPE) {
        let textLayerElem: HTMLElement = AnnotationManager.getTextLayer(canvas);
        if (textLayerElem) {
          textLayerElem.onmouseup = null;
        }
      } else {
        canvas.off('mouse:down', tool.onDragStart);
        canvas.off('mouse:move', tool.onDragMove);
        canvas.off('mouse:up', tool.onDragStop);
      }
      canvas.selection = true;
    }
  }

  /**
   * Prepare the canvas to be used with the new tool.
   * @param canvas Canvas.
   * @param toolType Type of new tool.
   */
  protected updateCanvasForTool(canvas: ICanvas, toolType: string) {
    let tool = this.getTool(toolType);
    if (tool != null && canvas) {
      if (toolType == HighlightTool.TYPE) { // Exception for highlight tool
        this.setTextSelectionMode(true);

        let textLayerElem: HTMLElement = AnnotationManager.getTextLayer(canvas);
        if (textLayerElem) {
          textLayerElem.onmouseup = tool.onDragStop as any;
        }
      } else {

        if (toolType == PencilTool.TYPE) { //  Exception for pencil tool
          (<any>canvas).freeDrawingBrush.color = this.currentColor;
          (<any>canvas).freeDrawingBrush.width = this.currentStrokeWidth * this.getScaleValue();
          canvas.isDrawingMode = true;
        }
        canvas.on('mouse:down', tool.onDragStart);
        canvas.on('mouse:move', tool.onDragMove);
        canvas.on('mouse:up', tool.onDragStop);

        canvas.selection = false;
      }
    }
    this.applyTextSelectionMode(canvas);
  };


  // ///////////////////////////
  //  Tool drawing properties
  // ///////////////////////////

  /**
   * Get a tool from available tools
   * @param type type of tool
   * @return {Tool} the tool or null if is not available
   */
  getTool(type: string): Tool {
    let toolUi: ToolAndUI = this._annotationTools$.getValue()[type];
    if (toolUi) {
      return toolUi.tool;
    }
    return null;
  }

  /**
   * Set color for tools.
   * @param hex Hex string.
   */
  setCurrentColor(hex: string): void {
    this.currentColor = hex;

    // If pencil was selected, reselect the tool to update the current color
    if (this._toolSelected$.getValue() === PencilTool.TYPE) {
      this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
      this.selectTool(PencilTool.TYPE);
    }
  }

  /**
   * Set stroke width / text size for tools.
   * @param width Stroke width to set.
   */
  setCurrentStrokeWidth(width: number): void {
    this.currentStrokeWidth = width;

    // If pencil was selected, reselect the tool to update the current width
    if (this._toolSelected$.getValue() === PencilTool.TYPE) {
      this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
      this.selectTool(PencilTool.TYPE);
    }
  }

  /**
   * Get current color.
   * @return {string} Hex string.
   */
  getCurrentColor(): string {
    return this.currentColor;
  }

  /**
   * Get current stroke width/ text size.
   * @return {number} Current stroke width.
   */
  getCurrentStrokeWidth(): number {
    return (this.currentStrokeWidth * this.getScaleValue());
  }

  /**
   * Terminate the use of a tool and set the default tool as current tool.
   */
  terminateToolSession(): void {
    this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
  }


  // ///////////////////////////
  //  Canvas management
  // ///////////////////////////

  private setCanvasObjectEditHandler(canvas: ICanvas) {
    // Add objects editing handlers -> save edited object when modified
    canvas.on('object:modified', (event: IEvent) => {
      if ((event.target.get('type') == 'group') && (event.target.get('uuid') == null)) { // Multiple object edited
        for (let o of (<IGroup>event.target).getObjects()) {
          this.editCanvasAnnotation(o);
        }
      } else { // Single object edited
        this.editCanvasAnnotation(event.target);
      }
    });
  }

  private setCanvasObjectSelectHandler(canvas: ICanvas) {
    canvas.on('selection:created', function (event: IEvent) {
      // In selection mode, block scaling ability on selected object -> only single selected objects can scale
      event.target.set({
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true
      });
    });
  }

  /**
   * Delete all annotations that has been selected in all canvases.
   */
  deleteSelectedAnnotations(): void {
    // Search in each canvas selected objects
    for (let canvas of this.canvases) {
      if (canvas) {
        let group = canvas.getActiveGroup();
        let activeObject = canvas.getActiveObject();
        if (activeObject) { // Single object selected
          this.deleteCanvasAnnotation(activeObject);
        }
        if (group) { // group of objects selected
          group.forEachObject((elem) => {
            this.deleteCanvasAnnotation(elem);
          });
        }
        canvas.deactivateAll().renderAll();
      }
    }
  }

  private static isSinglePath(object: IObject) {
    return object && (object.get(AnnotationManager.ELEM_TYPE) === PencilTool.TYPE) && object.get(AnnotationManager.PATH_N);
  }

  /**
   * Delete an annotation given the canvas object.
   * If object is a path, remove the single path (and not the annotation).
   * @param object Object to delete.
   */
  private deleteCanvasAnnotation(object: IObject) {
    let uuid = object.get(AnnotationManager.ELEM_UUID);
    let pageNumber = object.get(AnnotationManager.ELEM_PAGE);

    if (AnnotationManager.isSinglePath(object)) { // Single path object -> edit the annotation.

      let pathNum = object.get(AnnotationManager.PATH_N);

      let annotation = this._allAnnotations$.getValue()[pageNumber][uuid];
      if (annotation) {
        if ((<PencilAnnotation>annotation.data).paths.length <= 1) {
          this.deleteAnnotation(uuid, pageNumber);
        } else {
          (<PencilAnnotation>annotation.data).paths[pathNum] = null;
          if (this.canvases[pageNumber]) {
            this.canvases[pageNumber].remove(object);
          }
          this.editAnnotation(annotation); // edit pencil annotation means only delete some paths
        }
      }
    } else { // Delete the annotation
      this.deleteAnnotation(uuid, pageNumber);
    }
  }

  /**
   * Highlight an annotation on canvas, if present.
   * @param uuid Annotation uuid.
   * @param pageNumber Page number.
   */
  selectAnnotation(uuid: string, pageNumber: number) {
    let canvas = this.canvases[pageNumber];
    let object = this.annotationsObjects[uuid];
    if (canvas && object) {
      canvas.setActiveObject(object);
    }
  }

  /**
   * Deselect all annotations in all canvases.
   */
  deselectAllAnnotations() {
    for (let canvas of this.canvases) {
      if (canvas) {
        canvas.deactivateAll().renderAll();
      }
    }
  }

  /**
   * Switch between "text selection" and "drawing" mode.
   * @param textSelection True if text should be selectable, false to allow drawing on canvas.
   */
  setTextSelectionMode(textSelection: boolean) {
    if (this.isTextSelectionMode != textSelection) {

      if (textSelection) {
        this.selectTool(AnnotationManager.DEFAULT_TOOL_TYPE);
      }
      this.isTextSelectionMode = textSelection;

      for (let c of this.canvases) {
        this.applyTextSelectionMode(c);
      }
    }
  }

  private applyTextSelectionMode(canvas: ICanvas) {
    if (canvas) {
      canvas.getElement().parentElement.style.pointerEvents = (this.isTextSelectionMode) ? ('none') : ('auto');
    }
  }

  // ///////////////////////////
  //  Undo & Redo
  // ///////////////////////////

  /**
   * Undo the last action in annotation history.
   */
  public undo() {

    let undoAction = this.undoHistory.pop();
    if (undoAction) {
      switch (undoAction.action) {
        case 'add':
          // undo == delete annotation
          this.deleteAnnotation(undoAction.currentState.uuid, undoAction.currentState.pageNumber, false, true);
          break;
        case 'edit':
          // undo == delete current annotation, render previous (not edited) annotation, save edited annotation
          let oldObject = this.annotationsObjects[undoAction.currentState.uuid];
          let canvas = this.canvases[undoAction.currentState.pageNumber];
          if (canvas) {
            canvas.remove(oldObject);
            this.renderAnnotationToCanvas(canvas, undoAction.prevState);
            this.editAnnotation({
              ...undoAction.currentState,
              scales: {...undoAction.currentState.scales},
              data: {...undoAction.currentState.data}
            }, true);
          }
          break;
        case 'delete':
          // undo == render annotation (setting scales), save annotation on storage
          if (this.canvases[undoAction.prevState.pageNumber]) {
            let canvasAnnotation = this.renderAnnotationToCanvasSimple(this.canvases[undoAction.prevState.pageNumber], undoAction.prevState);

            let scales: AnnotationScales = {
              origLeft: (canvasAnnotation as any).origLeft,
              origTop: (canvasAnnotation as any).origTop,
              origScaleX: (canvasAnnotation as any).origScaleX,
              origScaleY: (canvasAnnotation as any).origScaleY
            };

            undoAction.prevState = this.addNewAnnotation(undoAction.prevState.type, undoAction.prevState.pageNumber, {
              pageNumber: undoAction.prevState.pageNumber,
              annotationData: undoAction.prevState.data,
              canvasAnnotation: canvasAnnotation,
              scales: scales
            }, undoAction.prevState.uuid, true);
          }
          break;
      }
      this.redoHistory.push(undoAction);
    }
  }

  /**
   * Redo the next action that has been undo.
   */
  public redo() {
    let redoAction = this.redoHistory.pop();
    if (redoAction) {

      switch (redoAction.action) {
        case 'add':
          // undo == render annotation, save annotation on storage
          if (this.canvases[redoAction.currentState.pageNumber]) {
            let canvasAnnotation = this.renderAnnotationToCanvasSimple(this.canvases[redoAction.currentState.pageNumber], redoAction.currentState);
            let scales: AnnotationScales = {
              origLeft: (canvasAnnotation as any).origLeft,
              origTop: (canvasAnnotation as any).origTop,
              origScaleX: (canvasAnnotation as any).origScaleX,
              origScaleY: (canvasAnnotation as any).origScaleY
            };

            redoAction.currentState = this.addNewAnnotation(redoAction.currentState.type, redoAction.currentState.pageNumber, {
              pageNumber: redoAction.currentState.pageNumber,
              annotationData: redoAction.currentState.data,
              canvasAnnotation: canvasAnnotation,
              scales: scales
            }, redoAction.currentState.uuid, true);
          }
          break;
        case 'edit':
          // undo == delete current (not edited) annotation, render previous annotation, save edited annotation
          let oldObject = this.annotationsObjects[redoAction.prevState.uuid];
          let canvas = this.canvases[redoAction.prevState.pageNumber];
          if (canvas) {
            canvas.remove(oldObject);
            this.renderAnnotationToCanvas(canvas, redoAction.currentState);
            this.editAnnotation({
              ...redoAction.prevState,
              scales: {...redoAction.prevState.scales},
              data: {...redoAction.prevState.data}
            }, true);
          }
          break;
        case 'delete':
          // undo == delete annotation
          this.deleteAnnotation(redoAction.prevState.uuid, redoAction.prevState.pageNumber, false, true);
          break;
      }
      this.undoHistory.push(redoAction);
    }
  }

  canUndo(): boolean {
    return this.undoHistory.length !== 0;
  }

  canRedo(): boolean {
    return this.redoHistory.length !== 0;
  }

  /**
   * Add an action (add / delete / edit annotation) to the undo history.
   * The redo history will be deleted due to new user action.
   * @param action Action performed by the user.
   */
  addToUndoHistory(action: AnnotationAction) {
    this.undoHistory.push(action);
    this.redoHistory = [];
  }

  // ///////////////////////////
  //  Utils
  // ///////////////////////////

  protected static showTempErrMessage(msg: string) {
    (UIkit as any).notification({
      message: msg,
      status: 'danger',
      pos: 'bottom-right',
      timeout: 5000
    });
  }

  /**
   * Get current pdf scale factor.
   * @return {number} Pdf scale value.
   */
  getScaleValue(): number {
    if (!this.pdfViewer) {
      return 1.0;
    }
    let scale = parseFloat(this.pdfViewer.currentScale);
    return isNaN(scale) ? 1.0 : scale;
  }

  /**
   * Scale canvas objects according to pdf scale factor.
   * @param canvas Canvas containing objects to scale.
   */
  protected scaleCanvasObjects(canvas: ICanvas) {
    const pdfScale = this.getScaleValue();
    let objects: IObject[] = canvas.getObjects();

    for (let i in objects) {

      let objectType = objects[i].get(AnnotationManager.ELEM_TYPE);

      let origLeft = (objects[i] as any).origLeft;
      let origTop = (objects[i] as any).origTop;
      let origScaleX = (objects[i] as any).origScaleX;
      let origScaleY = (objects[i] as any).origScaleY;

      if (objectType == NoteTool.TYPE) { // Note are scaled according pdf scale
        objects[i].scaleX = pdfScale;
        objects[i].scaleY = pdfScale;
      } else {
        objects[i].scaleX = pdfScale / origScaleX;
        objects[i].scaleY = pdfScale / origScaleY;
      }

      objects[i].left = ((origLeft * pdfScale) / origScaleX);
      objects[i].top = ((origTop * pdfScale) / origScaleY);

      // Call "onScale" handlers
      let tool = this.getTool(objectType);
      if (tool) {
        let pageNumber = objects[i].get(AnnotationManager.ELEM_PAGE);
        let uuid = objects[i].get(AnnotationManager.ELEM_UUID);
        objects[i] = tool.onScale(objects[i], this._allAnnotations$.getValue()[pageNumber][uuid]);
      }
      objects[i].setCoords();
    }
    canvas.renderAll();
    canvas.calcOffset();
  };

  getCanvas(pageNumber: number) {
    return this.canvases[pageNumber];
  }

  /**
   * Add an annotation to the "allAnnotations" variable/observable.
   * @param annotation New annotation.
   */
  protected addToAllAnnotations(annotation: BaseAnnotation) {
    let pageNumber = annotation.pageNumber;
    let annInPage = this._allAnnotations$.getValue()[pageNumber];
    if (!annInPage) {
      annInPage = {};
    }
    annInPage[annotation.uuid] = annotation;
    let temp = {};
    temp[pageNumber] = annInPage;
    this._allAnnotations$.next(Object.assign([], this._allAnnotations$.getValue(), temp));
  }

  protected static getTextLayer(canvas: ICanvas): HTMLElement {
    if (canvas) {
      let textLayerElem: HTMLElement = <HTMLElement>canvas.getElement().parentElement.previousSibling;
      if (textLayerElem && (textLayerElem).classList.contains('textLayer')) {
        return textLayerElem;
      }
    }
    return null;
  }

  /**
   * Get the date relative to the lesson of a time relative to the video
   * @param videoTime the time relative to the video
   * @param lessonStartDate the start date of the video / lesson
   * @return {any} the date of the "videoTime" relative to the lesson start date
   */
  protected static getVideoDateRelativeToLesson(videoTime: number, lessonStartDate: Date): Date {
    if (lessonStartDate && videoTime) {
      let d = new Date(lessonStartDate);
      d.setSeconds(d.getSeconds() + videoTime);
      return d;
    }
    return new Date();
  }
}
