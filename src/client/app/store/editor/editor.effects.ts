import {DataType} from '../../service/model/annotation';
import {AppState} from '../app-state';
import {Store} from '@ngrx/store';
import {Tool} from '../../service/tools/tool';
import {TOOLS} from '../../service/tools/tool-opaque-token';
import {Actions, Effect} from '@ngrx/effects';
import {Inject, Injectable} from '@angular/core';

import {ActionTypes, SelectTool} from './editor.actions';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';


@Injectable()
export class EditorEffects {


  @Effect({dispatch: false})
  getScreenshot$ = this.actions$.ofType<SelectTool>(ActionTypes.SELECT_TOOL)
    .map(a => a.payload)
    .withLatestFrom(this.store.select(s => s.editor.annotationContainer), this.store.select(s => s.editor.selectedTool))
    .do(([type, draw, selectedTool]) => {


      // Deselect previous tool
      // TODO
      (draw as any).off();


      // Select current tool
      const tool = this.getTool(type);
      if (tool) {
        tool.onToolSelected();
        draw.click(tool.onClick);

        draw.touchstart(tool.onDragStart);
        draw.touchend(tool.onDragStop);
        draw.touchmove(tool.onDragMove);

        draw.mousedown(tool.onDragStart);
        draw.mouseup(tool.onDragStop);
        draw.mousemove(tool.onDragMove);
      }

    });


  private getTool(type: string): Tool<DataType> {
    const index = this.tools.map(t => t.TYPE).indexOf(type);
    return index !== -1 ? this.tools[index] : null;
  }

  constructor(private actions$: Actions, @Inject(TOOLS) private tools: Tool<DataType>[], private store: Store<AppState>) {}

}
