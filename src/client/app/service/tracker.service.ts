import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class TrackerService {

  sessionId: string = null;
  userName: string = '';

  constructor() {
  }

  sessionIdMaker(user: string) {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    this.userName = user
    this.sessionId = hex;
  }

  trackEvent(type, value1, value2) {
    var href = window.location.href;
    var arr = href.split("/");
    var url = arr[0] + "//" + arr[2] + "/trackevent";
    var socket = io(url);
    socket.emit('log', {
      type: type,
      sessionId: this.sessionId,
      userName: this.userName,
      value1: value1,
      value2: value2,
      timestamp: new Date()
    });
  }

}
