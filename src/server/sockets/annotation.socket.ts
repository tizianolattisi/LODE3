import Socket = SocketIO.Socket;
import {Annotation, IAnnotation, isAnnotation} from '../models/db/Annnotation';
import {AnnotationSearch} from '../models/api/AnnotationSearch';
import {AnnotationId} from '../models/api/AnnotationId';
import {Types} from 'mongoose';
import * as chalk from 'chalk';

const enum WsFromClientEvents {
  ANNOTATION_GET = 'annotation-get',
  ANNOTATION_ADD = 'annotation-add',
  ANNOTATION_EDIT = 'annotation-edit',
  ANNOTATION_DELETE = 'annotation-delete'
};

const enum WsFromServerEvents {
  ANNOTATION_GET = 'annotation-get',
  ANNOTATION_ADD_FAIL = 'annotation-add-fail',
  ANNOTATION_EDIT_FAIL = 'annotation-edit-fail',
  ANNOTATION_DELETE_FAIL = 'annotation-delete-fail'
};

const socketListener = (socket: Socket) => {

  const userId: string = (socket as any).decoded_token.id;

  // ////////////////////////////////////////////
  // Get list of annotations
  // ////////////////////////////////////////////

  socket.on(WsFromClientEvents.ANNOTATION_GET, (data: AnnotationSearch) => {
    try {
      if (data && data.lectureId) {

        const search = {
          userId: new Types.ObjectId(userId),
          lectureId: data.lectureId,
          slideId: data.slideId || undefined
        };
        if (data.slideId) {
          search['slideId'] = data.slideId;
        }
        if (data.uuid) {
          search['uuid'] = data.uuid;
        }

        Annotation.find(search, (err, annotations: IAnnotation[]) => {
          if (!err && annotations) {
            socket.emit(WsFromServerEvents.ANNOTATION_GET, annotations.map(a => a.toJSON()));
          }
        });
      } else {
        console.warn(chalk.default.bold.yellow('> Annotation socket: "get" event with wrong payload'), data);
      }
    } catch (e) {
      printError(e, 'get', data);
    }
  });

  // ////////////////////////////////////////////
  // Add annotation
  // ////////////////////////////////////////////

  socket.on(WsFromClientEvents.ANNOTATION_ADD, (data: IAnnotation) => {
    try {
      if (isAnnotation(data)) {
        const annotation = new Annotation();
        annotation.uuid = data.uuid;
        annotation.lectureId = data.lectureId;
        annotation.slideId = data.slideId;
        annotation.type = data.type;
        annotation.timestamp = data.timestamp;
        annotation.data = data.data;
        annotation.userId = new Types.ObjectId(userId);

        annotation.save((err) => {
          if (err) {
            printError(err, 'add', data);
            socket.emit(WsFromServerEvents.ANNOTATION_ADD_FAIL, data);
          }
        });
      }
    } catch (e) {
      printError(e, 'add', data);
    }
  });

  // ////////////////////////////////////////////
  // Edit annotation
  // ////////////////////////////////////////////

  socket.on(WsFromClientEvents.ANNOTATION_EDIT, (data: IAnnotation) => {
    try {
      if (isAnnotation(data)) {
        Annotation.findOneAndUpdate({
          uuid: data.uuid,
          lectureId: data.lectureId,
          slideId: data.slideId,
          userId: new Types.ObjectId(userId)
        }, data, (err) => {
          if (err) {
            printError(err, 'edit', data);
            Annotation.findOne({
              uuid: data.uuid,
              lectureId: data.lectureId,
              slideId: data.slideId,
              userId: new Types.ObjectId(userId)
            }, (error, annotation: IAnnotation) => {
              if (!error && annotation) {
                socket.emit(WsFromServerEvents.ANNOTATION_EDIT_FAIL, annotation);
              }
            });
          }
        });
      }
    } catch (e) {
      printError(e, 'edit', data);
    }
  });


  // ////////////////////////////////////////////
  // Delete annotation
  // ////////////////////////////////////////////

  socket.on(WsFromClientEvents.ANNOTATION_DELETE, (data: AnnotationId) => {
    try {
      if (data && data.uuid && data.lectureId) {
        Annotation.findOneAndRemove({
          uuid: data.uuid,
          lectureId: data.lectureId,
          userId: new Types.ObjectId(userId)
        }, (err) => {
          if (err) {
            printError(err, 'delete', data);
            Annotation.findOne({
              uuid: data.uuid,
              lectureId: data.lectureId,
              userId: new Types.ObjectId(userId)
            }, (error, annotation: IAnnotation) => {
              if (!error && annotation) {
                socket.emit(WsFromServerEvents.ANNOTATION_DELETE_FAIL, annotation);
              }
            });
          }
        });
      }
    } catch (e) {
      printError(e, 'delete', data);
    }
  });

}

function printError(err: any, event: string, payload: any) {
  console.error(chalk.default.bold.red(`> Annotation socket: An error occurred. Event "${event}". Payload:`), payload, err);
}

export {socketListener as AnnotationSocketListener};
