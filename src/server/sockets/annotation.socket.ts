import Socket = SocketIO.Socket;
import { Types } from "mongoose";
import * as chalk from "chalk";
import * as chalkd from "socketio-jwt";
import { Annotation, IAnnotation, isAnnotation } from '../models/db/Annnotation';
import { AnnotationSearch } from '../models/api/AnnotationSearch';
import { AnnotationId } from '../models/api/AnnotationId';
import { IUser } from '../models/db/User';

const socketListener = (socket: Socket) => {

  const userId: string = (socket as any).decoded_token.id;

  // ////////////////////////////////////////////
  // Get list of annotations
  // ////////////////////////////////////////////

  socket.on('get', (data: AnnotationSearch) => {
    try {
      if (data && data.lectureId) {
        Annotation.find({
          uuid: data.uuid || undefined,
          lectureId: data.lectureId,
          slideId: data.slideId || undefined,
          userId: new Types.ObjectId(userId)
        }, (err, annotations: IAnnotation[]) => {
          if (!err && annotations) {
            socket.emit('get', annotations.map(a => a.toJSON()));
          }
        });
      } else {
        console.warn(chalk.bold.yellow('> Annotation socket: "get" event with wrong payload'), data);
      }
    } catch (e) {
      printError(e, 'get', data);
    }
  });

  // ////////////////////////////////////////////
  // Add annotation
  // ////////////////////////////////////////////

  socket.on('add', (data: IAnnotation) => {
    try {
      if (isAnnotation(data)) {
        let annotation = new Annotation();
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
            socket.emit('add-fail', data);
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

  socket.on('edit', (data: IAnnotation) => {
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
            }, (err, annotation: IAnnotation) => {
              if (!err && annotation) {
                socket.emit('edit-fail', annotation);
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

  socket.on('delete', (data: AnnotationId) => {
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
            }, (err, annotation: IAnnotation) => {
              if (!err && annotation) {
                socket.emit('delete-fail', annotation);
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
  console.error(chalk.bold.red(`> Annotation socket: An error occurred. Event "${event}". Payload:`), payload, err);
}

export { socketListener as AnnotationSocketListener };
