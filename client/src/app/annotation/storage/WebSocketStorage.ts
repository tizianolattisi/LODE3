import {BaseAnnotation} from "../model/BaseAnnotation";
import {Storage, StorageOperation, StorageOpType} from "./Storage";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import Socket = SocketIOClient.Socket;
import {UserService} from "../../user/user.service";


@Injectable()
export class WebSocketStorage implements Storage {

    private BASE_PATH = '/api/annotations';

    private socket: Socket;
    private eventEmit: Subject<StorageOperation>;

    constructor(private  userService: UserService) {

        this.socket = io.connect(location.host, {path: this.BASE_PATH});
        this.eventEmit = new Subject<StorageOperation>();

        this.socket
            .on('connect', ()=> {

                this.socket.emit('authenticate', {token: this.userService.getToken()});

                window.onbeforeunload = () => {
                    this.socket.disconnect();
                    this.socket.close();
                };
            })
            .on('unauthorized', ()=> {
                this.eventEmit.next({operation: StorageOpType.error, annotations: null});
            })
            .on('disconnect', ()=> {
                this.eventEmit.next({operation: StorageOpType.close, annotations: []});
            })
            //messages
            .on('annotations', (data: any)=> {
                this.eventEmit.next({operation: StorageOpType.get, annotations: data});
            })
            .on('add-fail', (data: any)=> {
                this.eventEmit.next({operation: StorageOpType.addFail, annotations: [data]});
            })
            .on('edit-fail', (data: any)=> {
                this.eventEmit.next({operation: StorageOpType.editFail, annotations: [data]});
            })
            .on('delete-fail', (data: any)=> {
                this.eventEmit.next({operation: StorageOpType.deleteFail, annotations: [data]});
            })
            .on('get-slide-changes', (data:any)=> {
                this.eventEmit.next({operation: StorageOpType.getChangeSlides, annotations: data});
            });
    }


    getAnnotation(documentId: string, annotationUuid: string) {
        this.socket.emit('get', {pdfId: documentId, uuid: annotationUuid});
        return Observable.of(null);
    };

    getAnnotations(documentId: string, sync: Date, pageNumber?: number) {
        this.socket.emit('gets', {pdfId: documentId, pageNumber: pageNumber, sync: sync});
        return Observable.of([]);
    };

    addAnnotation(documentId: string, annotation: BaseAnnotation) {
        (<any>annotation).pdfId = documentId;
        this.socket.emit('add', annotation);
    };

    editAnnotation(documentId: string, annotation: BaseAnnotation) {
        (<any>annotation).pdfId = documentId;
        this.socket.emit('edit', annotation);
    };

    deleteAnnotation(documentId: string, annotationUuid: string) {
        this.socket.emit('delete', {pdfId: documentId, uuid: annotationUuid});
    };

    getSlides(documentId: string) {
      this.socket.emit('get-slide-changes', {pdfId: documentId});
      return Observable.of([]);
    };


  onEvent() {
        return this.eventEmit;
    }
}
