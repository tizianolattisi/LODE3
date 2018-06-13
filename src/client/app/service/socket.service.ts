import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {WsFromClientEvents, WsFromServerEvents, WsMsg} from './model/ws-msg';

import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable()
export class SocketService implements OnInit {


  private serverUrl = 'http://localhost:8080/socket';

  //private socket: SocketIOClient.Socket;
  private stompClient;
  private observer: Subject<WsMsg>;

  constructor() {
    this.observer = new Subject();
  }

  ngOnInit() {

  }

  open(token: string) {

    // Close previous socket if exists
    this.close();

    // Open and listen on a new soket
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    this.initListen(token);
  }

  close() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  isOpen(): boolean {
    return this.stompClient!=null && this.stompClient.isOpen;
  }

  onReceive(): Observable<WsMsg> {
    return this.observer.asObservable();
  }

  send(eventType: WsFromClientEvents, data: any){
    if (this.stompClient.isOpen) {
      this.stompClient.send("/api/annotation/" + eventType.toString(), {}, JSON.stringify(data));
    } else {
      throw new Error('Socket is closed!');
    }
  }

  private initListen(token: string) {

    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/annotation-get", data => {
        that.observer.next({event: WsFromServerEvents.ANNOTATION_GET, data: data.body});
      });
      that.stompClient.subscribe("/annotation-add-fail", data => {
        that.observer.next({event: WsFromServerEvents.ANNOTATION_ADD_FAIL, data: data.body});
      });
      that.stompClient.subscribe("/annotation-edit-fail", data => {
        that.observer.next({event: WsFromServerEvents.ANNOTATION_EDIT_FAIL, data: data.body});
      });
      that.stompClient.subscribe("/annotation-delete-fail", data => {
        that.observer.next({event: WsFromServerEvents.ANNOTATION_DELETE_FAIL, data: data.body});
      });
    });


  }

}
