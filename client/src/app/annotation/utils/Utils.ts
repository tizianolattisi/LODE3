import {OpaqueToken} from "@angular/core";
export const generateUUID: ()=>string = ()=> {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};


export interface Point {
    x: number,
    y: number
}

export let STORAGE_OPAQUE_TOKEN = new OpaqueToken('annotation.storage');