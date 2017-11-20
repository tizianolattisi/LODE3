import {Tool} from '../../service/tools/tool';
import {TOOLS} from '../../service/tools/tool-opaque-token';
import {Annotation, DataType} from '../../service/model/annotation';
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'l3-lateral-bar-annotations',
  templateUrl: './lateral-bar-annotations.component.html',
  styleUrls: ['./lateral-bar-annotations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralBarAnnotationsComponent implements OnInit {

  annotations$: Observable<{[slideId: string]: {[annId: string]: Annotation}}>;

  private tools: {[type: string]: Tool<DataType>} = {};

  constructor(private store: Store<AppState>, @Inject(TOOLS) tools: Tool<DataType>[]) {
    tools.forEach(t => {
      this.tools[t.TYPE] = t;
    });
  }

  ngOnInit() {
    this.annotations$ = this.store.select(s => s.annotation.annotations);
  }

  // onSelect(index: number) {
  //   this.store.dispatch(new SelectAnnotation(index));
  // }

  getToolIcon(type: string) {
    return this.tools[type] ? this.tools[type].ICON : null;
  }

  getToolName(type: string) {
    return this.tools[type] ? this.tools[type].NAME : null;
  }
}
