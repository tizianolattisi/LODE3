import {ToolDescription} from "../../service/model/tool-description";

export interface ToolState {
  tools: ToolDescription[];
  selectedTool: string;
}
