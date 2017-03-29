import Socket = SocketIO.Socket;
import {IAnnotation, Annotation} from "../models/db/Annotation";
import {Types} from "mongoose";

/**
 * SocketIO requests handler
 * @param socket the socket
 */
export const ioListener = (socket: Socket) => {

    /**
     * Handle: Get specific annotation request
     */
    socket.on('get', (data)=> {
        try {
            if (data && data.uuid && data.pdfId) {
                Annotation.findOne({
                    uuid: data.uuid,
                    pdfId: data.pdfId,
                    uid: new Types.ObjectId((socket as any).decoded_token.id)
                }, (err, annotation: IAnnotation) => {
                    if (!err && annotation) {
                        socket.emit('annotations', [annotation.toJSON()]);
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

    /**
     * Handle: Get annotations for a pdf file request
     * It also synchronize annotation with LODE video if requested
     */
    socket.on('gets', (data)=> {
        try {
            if (data && data.pdfId) {
                let condition: any = {pdfId: data.pdfId, uid: new Types.ObjectId((socket as any).decoded_token.id)};
                if (data.pageNumber) {
                    condition.pageNumber = data.pageNumber;
                }
                Annotation.find(condition, (err, annotations: IAnnotation[]) => {
                    if (!err) {
                        let result: IAnnotation[] = []; // result that will be send as response
                        for (let a of annotations) {
                            if (data.sync) { // sync note with video if needed
                                a = syncAnnotation(new Date(data.sync), a);
                            }
                            if( a.data!='change-slide' ) {
                                result.push(<IAnnotation>a.toJSON()); // send note in response
                            }
                        }
                        socket.emit('annotations', result);
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }

    });

    /**
     * Handle: add a new annotation in database
     */
    socket.on('add', (annotation: IAnnotation)=> {
        try {
            if (annotation && annotation.uuid && annotation.pdfId && annotation.type && annotation.pageNumber && annotation.data) {

                let a = new Annotation();
                a.uuid = annotation.uuid;
                a.pdfId = annotation.pdfId;
                a.pageNumber = annotation.pageNumber;
                a.type = annotation.type;
                a.data = annotation.data;
                a.uid = new Types.ObjectId((socket as any).decoded_token.id);

                if (annotation.timestamp) { // note taken while watching video -> store timestamp relative to lesson (taken from the video)
                    a.timestamp = annotation.timestamp;
                }

                a.save((err)=> {
                    if (err) {
                        console.error(err);
                        socket.emit('add-fail', annotation);
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }

    });

    /**
     * Handle: Modify an existent annotation
     */
    socket.on('edit', (data: IAnnotation)=> {
        try {
            if (data && data.uuid && data.pdfId && data.type && data.pageNumber && data.data) {

                if (data.time) { // remove possible fields added from web app
                    delete data.time;
                }

                Annotation.findOneAndUpdate({
                    uuid: data.uuid,
                    pdfId: data.pdfId,
                    uid: new Types.ObjectId((socket as any).decoded_token.id)
                }, data, (err)=> {
                    if (err) {
                        console.error(err);
                        Annotation.findOne({uuid: data.uuid, pdfId: data.pdfId}, (err, annotation: IAnnotation) => {
                            if (!err && annotation) {
                                socket.emit('edit-fail', annotation);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

    /**
     * Handle: delete an annotation from database
     */
    socket.on('delete', (data)=> {
        try {
            if (data && data.pdfId && data.uuid) {
                Annotation.findOneAndRemove({
                    uuid: data.uuid,
                    pdfId: data.pdfId,
                    uid: new Types.ObjectId((socket as any).decoded_token.id)
                }, (err) => {
                    if (err) {
                        console.error(err);
                        Annotation.findOne({uuid: data.uuid, pdfId: data.pdfId}, (err, annotation: IAnnotation) => {
                            if (!err && annotation) {
                                socket.emit('delete-fail', annotation);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
};

const syncAnnotation = (startTime: Date, annotation: IAnnotation): IAnnotation => {
    annotation.time = (annotation.timestamp) ? // if annotation has been saved with a timestamp (because has been taken after a lesson)
        ((annotation.timestamp.getTime() - startTime.getTime()) / 1000) : // calculate time with the timestamp
        ((annotation._id.getTimestamp().getTime() - startTime.getTime()) / 1000); // otherwise use the MongoDB timestamp
    return annotation;
};