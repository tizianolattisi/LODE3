import {SelectTool} from '../../store/tool/tool.actions';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/app-state';
import {ToolDescription} from '../../service/model/tool-description';

@Component({
  selector: 'l3-tools-bar',
  templateUrl: './tools-bar.component.html',
  styleUrls: ['./tools-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent implements OnInit, OnDestroy {

  tools$: Observable<ToolDescription[]>;
  selectedToolType: string;

  private selectedToolTypeSubscr: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.tools$ = this.store.select(s => s.tool.tools);
    this.selectedToolTypeSubscr = this.store.select(s => s.tool.selectedTool).subscribe(toolType => this.selectedToolType = toolType);
  }

  onToolSelect(toolType: string) {
    this.store.dispatch(new SelectTool(toolType));
  }

  onSelectAll() {

  }

  onDelete() {

  }

  public ngOnDestroy(): void {
    this.selectedToolTypeSubscr.unsubscribe();
  }
}
