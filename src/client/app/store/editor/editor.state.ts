import {ToolDescription} from '../../service/model/tool-description';

export interface EditorState {

  tools: ToolDescription[];
  selectedTool: string;

  color: string;
  stroke: number;
}
