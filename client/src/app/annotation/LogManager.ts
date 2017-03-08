import {BaseAnnotation} from "./model/BaseAnnotation";

export interface LogManager {

    newLog(type: string, subtype: string, value: number): BaseAnnotation;
}
