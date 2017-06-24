import {ToolDescription} from '../model/tool-description';

export abstract class Tool {

  readonly abstract TYPE: string;
  readonly abstract NAME: string;
  readonly abstract ICON: string;


  getDescription(): ToolDescription {
    return {
      name: this.NAME,
      type: this.TYPE,
      icon: this.ICON,
      tool: this
    }
  }
}
