import {Router} from 'express';
import {Lecture} from '../models/db/Lecture';
import {ErrorResponse} from '../models/api/ErrorResponse';
import {LiveLectureService} from '../services/live.lecture.service';


const PATH = '/lecture';

const router: Router = Router();

/**
 * Get all the lectures (live excluded if not made explicit).
 */
router.get(PATH, (req, res, next) => {

  const liveLectures = req.query.live;

  if (liveLectures === 'true') {
    const lectures = LiveLectureService.getLiveLectures();
    res.send(lectures);
  } else {
    // Exclude live lectures from result list
    Lecture.find({uuid: {$nin: LiveLectureService.getLiveLectureIds()}})
      .then((lectures: Lecture[]) => res.send(lectures.map(l => l.toJSON())))
      .catch(err => next(err));
  }
});

/**
 * Get basic data of a lecture (name, ...).
 */
router.get(PATH + '/:lectureId', (req, res, next) => {

  const lectureId = req.params['lectureId'];

  // First find in live lecture
  const lecture = LiveLectureService.getLiveLecture(lectureId);

  if (lecture) {
    // Live lecture exists -> send it
    res.send(lecture);
  } else {
    // Find lecture in db
    Lecture.findOne({uuid: lectureId})
      .then(l => {
        if (!l) {
          return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
        }
        res.send(l.toJSON())
      })
      .catch(err => next(err));
  }

});

/**
 * Get screenshots of a user.
 */
router.get(PATH + '/:lectureId/myscreenshots', (req, res, next) => {

  // const lectureId = req.params['lectureId'];
  // Lecture.findOne({uuid: lectureId})
  //   .then(lecture => {
  //     if (!lecture) {
  //       return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
  //     }

  //     return res.send(lecture.toJSON()); // TODO toJSON  + add screenshots
  //   })
  //   .catch(err => {
  //     return next(err);
  //   })
  return res.sendStatus(501);
});

/**
 * Take a snapshot of the slide that is currently displayed during a lecture.
 */
router.get(PATH + '/:lectureId/snapshot', (req, res, next) => {
  // TODO pin
  // TODO implement
  const lectureId = req.params['lectureId'];
  console.log('> REQUEST SNAP FOR ' + lectureId);
  LiveLectureService.getNextScreenshot(lectureId)
    .subscribe(snapshotPath => {
      console.log('> SNAPSHOT AQUIRED: ' + snapshotPath);
      return res.json(snapshotPath);
    }, err => {
      return next(err);
    });
});

/**
 * Validate Pin for a live lecture.
 */
router.post(PATH + '/:lectureId/verifypin', (req, res, next) => {

  const lectureId = req.params['lectureId'];

  if (!req.body.pin) {
    return res.status(400).send(new ErrorResponse('missing-pin', 'Mmissing pin'));
  }

  if (!LiveLectureService.liveLectureExists(lectureId)) {
    return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
  }

  if (LiveLectureService.getPin(lectureId) !== req.body.pin) {
    return res.status(400).send(new ErrorResponse('wrong-pin', 'Pin is not valid'));
  }

  return res.sendStatus(204);
});


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

export {router as LectureRouter, PATH as LECTURE_PATH};
