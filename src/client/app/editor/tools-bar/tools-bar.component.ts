import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/app-state';
import {SelectTool, SetStroke, SetColor} from '../../store/editor/editor.actions';
import {ToolDescription} from '../../service/model/tool-description';
import {ResetSelection, DeleteSelection} from '../../store/annotation/annotation.actions';

@Component({
  selector: 'l3-tools-bar',
  templateUrl: './tools-bar.component.html',
  styleUrls: ['./tools-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent implements OnInit, OnDestroy {

  stroke$: Observable<number>;
  color$: Observable<string>;

  tools$: Observable<ToolDescription[]>;
  selectedToolType: string;
  selectedToolColor: string;

  isTouchDevice: boolean;
  colors: String[] = ['#FF0000', '#00FF00', '#0000FF'];

  private selectedToolTypeSubscr: Subscription;
  private selectedToolColorSubscr: Subscription;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.isTouchDevice = this.checkIsTouchDevice();
    this.tools$ = this.store.select(s => s.editor.tools);
    this.stroke$ = this.store.select(s => s.editor.stroke);
    this.color$ = this.store.select(s => s.editor.color);
    this.selectedToolTypeSubscr = this.store.select(s => s.editor.selectedTool).subscribe(toolType => {
      this.selectedToolType = toolType;
      this.cd.detectChanges();
    });
    this.selectedToolColorSubscr = this.store.select(s => s.editor.color).subscribe(toolColor => {
      this.selectedToolColor = toolColor;
      console.log(toolColor);
      this.cd.detectChanges();
    });
  }

  checkIsTouchDevice() {
    var el = document.createElement('div');
    el.setAttribute('ontouchstart', 'return;');
    var check = typeof el.ontouchstart === "function";
    return check;
  }

  onToolSelect(toolType: string) {
    this.store.dispatch(new SelectTool(toolType));
  }

  onColorPencilSelect(color: string) {
    this.onColorChange(color);
    this.onToolSelect('pencil');
    this.onStrokeChange(16);
  }

  onStrokeChange(value: any) {
    value = value ? parseInt(value, 10) : 2;
    this.store.dispatch(new SetStroke(value));
  }

  onColorChange(value: string) {
    this.store.dispatch(new SetColor(value));
  }

  onDeselectAll() {
    this.store.dispatch(new ResetSelection());
  }

  onDelete() {
    this.store.dispatch(new DeleteSelection());
  }

  public ngOnDestroy(): void {
    this.selectedToolTypeSubscr.unsubscribe();
  }
}
