import { Injectable } from '@angular/core';
import {ToolAndUI} from "./utils/ToolAndUI";
import {PencilTool} from "./tools/PencilTool";
import {RectTool} from "./tools/RectTool";
import {CircleTool} from "./tools/CircleTool";
import {ArrowTool} from "./tools/ArrowTool";
import {TextTool} from "./tools/TextTool";
import {NoteTool} from "./tools/NoteTool";
import {HighlightTool} from "./tools/HighlightTool";

@Injectable()
export class ToolService {

  tools: {[type: string]: ToolAndUI};

  constructor() {
    this.tools = {};

    let pencilTool = new PencilTool();
    let rectTool = new RectTool();
    let circleTool = new CircleTool();
    let arrowTool = new ArrowTool();
    let textTool = new TextTool();
    let noteTool = new NoteTool();
    let highlightTool = new HighlightTool();

    this.tools[pencilTool.getType()] = {tool: pencilTool, iconClass: "mdi-lead-pencil", text: 'Pencil'};
    this.tools[rectTool.getType()] = {tool: rectTool, iconClass: "mdi-shape-rectangle-plus", text: 'Rectangle'};
    this.tools[circleTool.getType()] = {tool: circleTool, iconClass: "mdi-shape-circle-plus", text: 'Circle'};
    this.tools[arrowTool.getType()] = {tool: arrowTool, iconClass: "mdi-call-made", text: 'Arrow'};
    this.tools[textTool.getType()] = {tool: textTool, iconClass: "mdi-format-text", text: 'Text'};
    this.tools[noteTool.getType()] = {tool: noteTool, iconClass: "mdi-comment-text-outline", text: 'Note'};
    this.tools[highlightTool.getType()] = {tool: highlightTool, iconClass: "mdi-grease-pencil", text: 'Highlight'};
  }


  getTools(): {[type: string]: ToolAndUI} {
    return this.tools;
  }

  getToolIconClass(type: string): string {
    let tool = this.tools[type];
    if (tool && tool.iconClass) {
      return tool.iconClass;
    } else {
      return "";
    }
  }
}
