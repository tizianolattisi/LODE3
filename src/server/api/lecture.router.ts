import {Router} from 'express';
import {Lecture} from '../models/db/Lecture';
import {ErrorResponse} from '../models/api/ErrorResponse';
import {LiveLectureService} from '../services/live.lecture.service';


const PATH = '/lecture';

const router: Router = Router();


/**
 * Create a pdf with all the slides and the annotations of a student for a lecture.
 */
router.get(PATH + '/:lectureId/pdf', (req, res, next) => {

  // TODO implement
  return res.sendStatus(501);
  /*
  let pdfHash = req.params.pdfId;
  let pdfData: PdfCache = cache.get(pdfHash);

  if (pdfData) {

    // get annotations
    Annotation.find({
      pdfId: pdfData.hash,
      uid: req.user.id
    }).exec((err, annotations: IAnnotation[]) => {
      if (err) {
        return next(err);
      }

      if (annotations.length == 0) {
        // send pdf
        res.set('Content-Type', 'application/pdf');
        res.write(pdfData.data);
        res.end();
      } else {
        // write annotations and send pdf
        writeAnnotations(pdfData, annotations, (err, result) => {
          if (err) {
            return next(err);
          }
          res.set('Content-Type', 'application/pdf');
          res.write(result);
          res.end();
        });
      }
    });
  } else {
    res.sendStatus(404);
  }
  */
});

/**
 * Take a snapshot of the slide that is currently displayed during a lecture.
 */
router.get(PATH + '/:lectureId/snapshot', (req, res, next) => {
  // TODO implement
  const lectureId = req.param('lectureId');
  console.log('> REQUEST SNAP FOR ' + lectureId);
  LiveLectureService.getNextSnapshot(lectureId)
    .subscribe(snapshotPath => {
      console.log('> SNAPSHOT AQUIRED: ' + snapshotPath);
      return res.json(snapshotPath);
    }, err => {
      return next(err);
    });
});

/**
 * Get all the slides (as an array of image urls) saved for a lecture.
 */
router.get(PATH + '/:lectureId/slides', (req, res, next) => {
  // TODO implement
  return res.sendStatus(501);
});

/**
 * Get lecture infromation.
 */
router.get(PATH + '/:lectureId', (req, res, next) => {

  const lectureId = req.param('lectureId');
  Lecture.findOne({uuid: lectureId})
    .then(lecture => {
      if (!lecture) {
        return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
      }

      return res.send(lecture.toJSON());
    })
    .catch(err => {
      return next(err);
    })
  return res.sendStatus(501);
});

export {router as LectureRouter, PATH as LECTURE_PATH};
