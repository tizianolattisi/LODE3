import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

/** 
 * Service che permette di tenere traccia delle azioni dell'utente nel viewer
*/
@Injectable()
export class TrackerService {

  sessionId: string = null; // id della sessione
  userName: string = ''; // username dell'utente

  constructor() {
  }

  /**
   * Genera un id per la sessione e setta l'username
   * @param user username dell'utente
   */
  sessionIdMaker(user: string) {
    user = 'cicici'
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    this.userName = user
    this.sessionId = hex;
  }

  /**
   * Invia un log per un determinato evento
   * @param type tipo di evento
   * @param value1 primo valore dell'evento
   * @param value2 secondo valore dell'evento
   */
  trackEvent(type, value1, value2) {
    this.sessionIdMaker('dd')
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
