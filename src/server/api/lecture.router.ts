import * as chalk from 'chalk';
import {Router} from 'express';
import {Lecture} from '../models/db/Lecture';
import {ErrorResponse} from '../models/api/ErrorResponse';
import {LiveLectureService} from '../services/live.lecture.service';
import {User} from '../models/db/User';

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

  const userId = req.user.id;
  const lectureId = req.params['lectureId'];

  User.findById(userId)
    .then(user => {

      if (!user) {
        return res.status(404).send(new ErrorResponse('not-found', 'User not found'));
      }

      if (!user.lectures) {
        return res.json([]);
      }

      const userLecture = user.lectures.filter(l => l.uuid === lectureId)[0];

      if (!userLecture) {
        return res.json([]);
      }

      const userScreenshots = userLecture.screenshots || [];

      // Get all info about screenshots
      Lecture.findOne({uuid: lectureId})
        .then(lecture => {

          if (!lecture) {
            return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
          }

          const ss = lecture.screenshots.filter(s => userScreenshots.indexOf(s.fileName) !== -1);

          res.json(ss);
        })
        .catch(err => next(err));

    })
    .catch(err => next(err));
});

/**
 * Take a screenshots of the slide that is currently displayed during a lecture.
 */
router.get(PATH + '/:lectureId/screenshot', (req, res, next) => {

  const userId = req.user.id;
  const lectureId = req.params['lectureId'];
  const pin = req.header('pin');

  // Request has no pin
  if (!pin) {
    return res.status(400).send(new ErrorResponse('missing-pin', 'Pin for live lecture is missing'));
  }

  const lPin = LiveLectureService.getPin(lectureId);

  // Check pin
  if (lPin !== pin) {
    return res.status(401).send(new ErrorResponse('wrong-pin', 'Pin for live lecture is wrong'));
  }

  console.log(chalk.blue(`> User "${userId}" requests a screenshot for lecture "${lectureId}".`));


  LiveLectureService.getNextScreenshot(lectureId)
    .subscribe(screenshot => {

      // Save screenshot into user's lectures list
      User.findById(userId)
        .then(user => {
          const userLecture = user.lectures.filter(l => l.uuid === lectureId)[0];

          if (userLecture) {
            // TODO check if user has already the screenshot (maybe using Mongo index)
            if (userLecture.screenshots.indexOf(screenshot.fileName) === -1) {
              userLecture.screenshots.push(screenshot.fileName);
            } else {
              return res.status(400).send(
                new ErrorResponse('no-new-screenshot', 'Current screenshot is already in user\'s screenshot list')
              );
            }
          } else { // First screenshot for this lecture
            user.lectures.push({uuid: lectureId, screenshots: [screenshot.fileName]});
          }

          user.save()
            .then(() => {
              res.json(screenshot);
            })
            .catch(err => next(err));

        })
        .catch(err => next(err));

      // User.update(
      //   {_id: userId, 'lectures._id': lectureId},
      //   {'$push': {'lectures.$.screenshots': screenshot.fileName}}
      // )
      //   .then(() => {
      //     return res.json(screenshot);
      //   })
      //   .catch(err => next(err));


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
