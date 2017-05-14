import {Component, ElementRef, ViewChild} from '@angular/core';
import {AnnotationManager} from "../../annotation/AnnotationManager";

@Component({
  selector: 'annotation-toolbar',
  templateUrl: './annotation-toolbar.component.html',
  styleUrls: ['./annotation-toolbar.component.scss']
})
export class AnnotationToolbarComponent {

  selectedTool: string = 'default';
  colorPickerHide: boolean = true;

  @ViewChild('cpCanvas') cpCanvasElem: ElementRef;

  constructor(public am: AnnotationManager) {

    this.am.toolSelected$.subscribe(tool => {
      this.selectedTool = tool;
    });
  }

  ngOnInit(): void {

    this.colorPickerRender();
    this.colorPickerAddHandlers();
  }

  selectDefaultTool() {
    this.selectTool('default');
  };

  selectTool(type: string) {
    this.am.selectTool(type);
  };

  clearSelection(): void {
    this.am.deselectAllAnnotations();
  }

  deleteSelectedAnnotations() {
    this.am.deleteSelectedAnnotations();
  }

  switchTextSelectionMode() {
    this.am.setTextSelectionMode(!this.am.isTextSelectionMode);
  }

  private setColor(hexString: string) {
    this.am.setCurrentColor(hexString);
  }

  showHideColorPicker() {
    this.colorPickerHide = !this.colorPickerHide;
  }

  private colorPickerRender() {
    let ctx = (this.cpCanvasElem.nativeElement as HTMLCanvasElement).getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, this.cpCanvasElem.nativeElement.width, 0);

    // Create color gradient
    gradient.addColorStop(0, "rgb(255,   0,   0)");
    gradient.addColorStop(0.15, "rgb(255,   0, 255)");
    gradient.addColorStop(0.33, "rgb(0,     0, 255)");
    gradient.addColorStop(0.49, "rgb(0,   255, 255)");
    gradient.addColorStop(0.67, "rgb(0,   255,   0)");
    gradient.addColorStop(0.84, "rgb(255, 255,   0)");
    gradient.addColorStop(1, "rgb(255,   0,   0)");

    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Create semi transparent gradient (white -> trans. -> black)
    gradient = ctx.createLinearGradient(0, 0, 0, this.cpCanvasElem.nativeElement.height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
    gradient.addColorStop(1, "rgba(0,     0,   0, 1)");

    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private colorPickerAddHandlers() {
    this.cpCanvasElem.nativeElement.onclick = (e: MouseEvent) => {
      var pos_x = e.pageX - this.cpCanvasElem.nativeElement.offsetLeft;
      var pos_y = e.pageY - this.cpCanvasElem.nativeElement.offsetTop - 40;
      let data = (this.cpCanvasElem.nativeElement as HTMLCanvasElement).getContext('2d').getImageData(pos_x, pos_y, 1, 1).data;
      this.setColor(this.colorToHex(data[0], data[1], data[2]));
    }
  };


  private  colorToHex(r: number, g: number, b: number) {
    let str = '#';
    let dHex = r.toString(16);
    str += (dHex.length == 2) ? (dHex) : ('0' + dHex);
    dHex = g.toString(16);
    str += (dHex.length == 2) ? (dHex) : ('0' + dHex);
    dHex = b.toString(16);
    str += (dHex.length == 2) ? (dHex) : ('0' + dHex);
    return str;
  }
}
