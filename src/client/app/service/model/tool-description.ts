import {DataType} from './annotation';
import {Tool} from '../tools/tool';

export interface ToolDescription {
  type: string;
  name: string;
  icon: string;
  tool: Tool<DataType>;
}
