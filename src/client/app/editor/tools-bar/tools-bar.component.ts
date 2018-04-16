import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/app-state';
import {SelectTool, SetStroke, SetColor, SetTag} from '../../store/editor/editor.actions';
import {ToolDescription} from '../../service/model/tool-description';
import {ResetSelection, DeleteSelection} from '../../store/annotation/annotation.actions';
import {checkIsLiteLayout} from '../../shared/lite-layout-detect';

@Component({
  selector: 'l3-tools-bar',
  templateUrl: './tools-bar.component.html',
  styleUrls: ['./tools-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent implements OnInit, OnDestroy {

  stroke$: Observable<number>;
  color$: Observable<string>;
  tag$: Observable<string>;

  tools$: Observable<ToolDescription[]>;
  filteredTools: ToolDescription[];
  selectedToolType: string;
  selectedToolColor: string;
  selectedToolTag: string;

  isLiteLayout: boolean;
  colors: String[] = ['#FF0000', '#00FF00', '#0000FF'];
  tags: String[] = ['generic', 'important', 'question', 'remember', 'favorite'];

  private selectedToolTypeSubscr: Subscription;
  private selectedToolColorSubscr: Subscription;
  private selectedToolTagSubscr: Subscription;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLiteLayout = checkIsLiteLayout();
    this.tools$ = this.store.select(s => s.editor.tools);
    this.tools$.subscribe(data => this.filteredTools = this.filterTools(data))
    this.stroke$ = this.store.select(s => s.editor.stroke);
    this.color$ = this.store.select(s => s.editor.color);
    this.tag$ = this.store.select(s => s.editor.tag);
    this.selectedToolTypeSubscr = this.store.select(s => s.editor.selectedTool).subscribe(toolType => {
      this.selectedToolType = toolType;
      this.cd.detectChanges();
    });
    this.selectedToolColorSubscr = this.store.select(s => s.editor.color).subscribe(toolColor => {
      this.selectedToolColor = toolColor;
      this.cd.detectChanges();
    });
    this.selectedToolTagSubscr = this.store.select(s => s.editor.tag).subscribe(toolTag => {
      this.selectedToolTag = toolTag;
      this.cd.detectChanges();
    });
  }

  filterTools(tools: ToolDescription[]) {
    return tools.filter(t => t.type!='pencil' && t.type!='bookmark');
  }

  onToolSelect(toolType: string) {
    this.store.dispatch(new SelectTool(toolType));
  }

  onColorPencilSelect(color: string) {
    this.onColorChange(color);
    this.onToolSelect('pencil');
    this.onStrokeChange(16);
  }

  onBookmarkSelect(tag: string) {
    this.onTagChange(tag);
    this.onToolSelect('bookmark');
  }

  onStrokeChange(value: any) {
    value = value ? parseInt(value, 10) : 2;
    this.store.dispatch(new SetStroke(value));
  }

  onColorChange(value: string) {
    this.store.dispatch(new SetColor(value));
  }

  onTagChange(value: string) {
    this.store.dispatch(new SetTag(value));
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
