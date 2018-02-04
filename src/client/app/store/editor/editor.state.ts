import {ToolDescription} from '../../service/model/tool-description';
import {Doc} from 'svg.js';


export interface EditorState {

  annotationContainer: Doc;

  tools: ToolDescription[];
  selectedTool: string;

  color: string;
  stroke: number;
}
