import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {WsFromServerEvents, WsMsg} from './model/ws-msg';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  private BASE_PATH = '/api/annotation';

  private socket: SocketIOClient.Socket;
  private observer: Subject<WsMsg>;

  constructor() {
    this.observer = new Subject();
  }

  open(token: string) {

    // Close previous socket if exists
    this.close();

    // Open and listen on a new soket
    this.socket = io.connect(location.host, {path: this.BASE_PATH});
    this.initListen(token);
  }

  close() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.close();
      this.socket = null;
    }
  }

  isOpen(): boolean {
    return !!this.socket;
  }

  onReceive(): Observable<WsMsg> {
    return this.observer.asObservable();
  }

  send(eventType: WsFromServerEvents, data: any) {
    if (this.socket) {
      this.socket.emit(eventType, data);
    }
  }

  private initListen(token: string) {
    this.socket
      .on('connect', () => {
        // Authenticate user
        this.socket.emit('authenticate', {token});

        // Close ws when browser windows is closed
        window.onbeforeunload = () => {
          this.socket.disconnect();
          this.socket.close();
          this.socket = null;
        };
      })
      .on('unauthorized', () => {
        this.observer.next({event: WsFromServerEvents.UNAUTHORIZED});
        this.close();
      })
      .on('disconnect', () => {
        this.observer.next({event: WsFromServerEvents.DISCONNECT});
        this.socket = null;
      })

      // Listen for messages

      .on(WsFromServerEvents.ANNOTATION_GET, data => {
        this.observer.next({event: WsFromServerEvents.ANNOTATION_GET, data});
      })
      .on(WsFromServerEvents.ANNOTATION_ADD_FAIL, data => {
        this.observer.next({event: WsFromServerEvents.ANNOTATION_ADD_FAIL, data});
      })
      .on(WsFromServerEvents.ANNOTATION_EDIT_FAIL, data => {
        this.observer.next({event: WsFromServerEvents.ANNOTATION_EDIT_FAIL, data});
      })
      .on(WsFromServerEvents.ANNOTATION_ADD_FAIL, data => {
        this.observer.next({event: WsFromServerEvents.ANNOTATION_ADD_FAIL, data});
      });

  }

}
