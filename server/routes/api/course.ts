import {Router} from 'express';
import http = require('http');
import {Promise} from 'es6-promise';
import xml2js = require('xml2js');
import {LodeData} from "../../models/rest/LodeData";
import {default as Lecture} from "../../models/rest/LodeLecture";
import {LODE_BASE_URL} from "../../commons/config";
import {Annotation, IAnnotation} from "../../models/db/Annotation";
import {Types} from "mongoose";

const courseRouter: Router = Router();
const PATH = '/courses';

/**
 * Given course and lecture names, return the LODE data concerning that lecture.
 */
courseRouter.get(PATH + '/:courseId/lectures/:lectureId', (req, res, next) => {

    let course = req.params.courseId;
    let lecture = req.params.lectureId;
    let lectureData: Lecture = new Lecture();
    let timestamp: Date;

    fetchInfo(course, lecture)
        .then((lodeInfo) => {

            // lodeInfo.lezione.video.timestamp = new Date('11-06-2016 16:25');
            timestamp = lodeInfo.data.info.timestamp

            lectureData.information = {
                course: lodeInfo.data.info.course,
                title: lodeInfo.data.info.title,
                professor: lodeInfo.data.info.lecturer,
            };
            lectureData.video = {
                url: LODE_BASE_URL + '/' + course + '/' + lecture + '/' + lodeInfo.data.camvideo.name,
                start: lodeInfo.data.info.timestamp,
                duration: lodeInfo.data.info.totaltime
            };

        })
        .then(function() {
            let condition: any = {};
            Annotation.find(condition, (err, annotations: IAnnotation[]) => {
                if (!err) {
                    for (let a of annotations) {
                        if( a.data=='change-slide' ) {
                            a = syncAnnotation(new Date(timestamp), a);
                            lectureData.addSlide(course, lecture, a.pageNumber, 'title', 'url', a.time);
                        }
                    }
                }
                return res.json(lectureData);
            });
        })
        .catch((err)=> {
            return next(err);
        });
});


/**
 * Fetch video lecture data from LODE server
 * @param course course name
 * @param lecture lecture name
 * @return {Promise<LodeData>} A promise with LODe data
 */
const fetchInfo = (course: string, lecture: string): Promise<LodeData> => {

    return new Promise<LodeData>((resolve, reject) => {

        let url = LODE_BASE_URL + '/' + course + '/' + lecture + '/data.xml';

        http.get(url, (response) => {
            var data: string = '';

            response.on('data', (chunk)=> {
                data = data + chunk;
            });

            response.on('end', ()=> {

                xml2js.parseString(data, {explicitArray: false}, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                });
            });

        })
            .on('error', (err) => {
                reject(err);
            });
    });
};

const syncAnnotation = (startTime: Date, annotation: IAnnotation): IAnnotation => {
    annotation.time = (annotation.timestamp) ? // if annotation has been saved with a timestamp (because has been taken after a lesson)
        ((annotation.timestamp.getTime() - startTime.getTime()) / 1000) : // calculate time with the timestamp
        ((annotation._id.getTimestamp().getTime() - startTime.getTime()) / 1000); // otherwise use the MongoDB timestamp
    return annotation;
};

export {courseRouter};