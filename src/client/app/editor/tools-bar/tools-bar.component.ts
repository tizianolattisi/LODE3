import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/app-state';
import {SelectTool, SetStroke} from '../../store/editor/editor.actions';
import {ToolDescription} from '../../service/model/tool-description';

@Component({
  selector: 'l3-tools-bar',
  templateUrl: './tools-bar.component.html',
  styleUrls: ['./tools-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent implements OnInit, OnDestroy {

  stroke$: Observable<number>;

  tools$: Observable<ToolDescription[]>;
  selectedToolType: string;

  private selectedToolTypeSubscr: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.tools$ = this.store.select(s => s.editor.tools);
    this.stroke$ = this.store.select(s => s.editor.stroke);
    this.selectedToolTypeSubscr = this.store.select(s => s.editor.selectedTool).subscribe(toolType => this.selectedToolType = toolType);
  }

  onToolSelect(toolType: string) {
    this.store.dispatch(new SelectTool(toolType));
  }

  onStrokeChange(value: any) {
    value = value ? parseInt(value, 10) : 2;
    this.store.dispatch(new SetStroke(value));
  }

  onSelectAll() {

  }

  onDelete() {

  }

  public ngOnDestroy(): void {
    this.selectedToolTypeSubscr.unsubscribe();
  }
}
