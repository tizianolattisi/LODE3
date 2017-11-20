import {ToolDescription} from '../../service/model/tool-description';

import * as SVG from 'svg.js';

export interface EditorState {

  annotationContainer: SVG.Doc;

  tools: ToolDescription[];
  selectedTool: string;

  color: string;
  stroke: number;
}
