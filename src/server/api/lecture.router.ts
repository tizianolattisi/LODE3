import * as chalk from 'chalk';
import { Router } from 'express';
import { Lecture, Screenshot, IScreenshotComplete, IScreenshot } from '../models/db/Lecture';
import { ErrorResponse } from '../models/api/ErrorResponse';
import { LiveLectureService } from '../services/live.lecture.service';
import { User } from '../models/db/User';
import { Annotation, IAnnotation } from '../models/db/Annnotation';
import { PdfCreator } from '../services/pdf-creator';
import { STORAGE_PATH, STORAGE_SLIDES_FOLDER } from '../commons/config';
import { ObjectId } from 'bson';

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
    Lecture.find({ uuid: { $nin: LiveLectureService.getLiveLectureIds() } })
      .sort([['uuid', 'descending']])
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
    Lecture.findOne({ uuid: lectureId })
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
 * Get basic data of a lecture (name, ...) using course name and title of the lecture for the video player.
 */
router.get('/video/:course/:title', (req, res, next) => {
  console.log("sono in api")
  const courseName = req.params['course'];
  const titleName = req.params['title'];
  // Find lecture in db
  Lecture.findOne({ course: courseName, name: titleName })
    .then(l => {
      if (!l) {
        return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
      }
      res.send(l.toJSON())
    })
    .catch(err => next(err));
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
      Lecture.findOne({ uuid: lectureId })
        .then(lecture => {

          if (!lecture) {
            return res.status(404).send(new ErrorResponse('not-found', 'Lecture not found'));
          }

          // const ss = lecture.screenshots.filter(s => userScreenshots.indexOf(s.fileName) !== -1);

          const lIds = lecture.screenshots.map(s => s._id).map(id => id.toHexString());

          const ss: IScreenshot[] = userScreenshots.map(screenShotId => {

            const index = lIds.indexOf(screenShotId);

            return (index !== -1) ?
              lecture.screenshots[index] : // Return the screenshot
              ({                           // Return blank screenshot
                _id: screenShotId,
                fileName: 'blank',
                img: 'blank',
                name: '',
                timestamp: Date.now()
              } as IScreenshot);

          }).filter(s => !!s);

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

  const blank = req.query['blank'];

  // Request has no pin
  if (!pin) {
    return res.status(400).send(new ErrorResponse('missing-pin', 'Pin for live lecture is missing'));
  }

  const lPin = LiveLectureService.getPin(lectureId);

  // Check pin
  if (lPin !== pin) {
    return res.status(401).send(new ErrorResponse('wrong-pin', 'Pin for live lecture is wrong'));
  }

  console.log(chalk.default.blue(`> User "${userId}" requests a screenshot for lecture "${lectureId}".`));


  if (blank) {
    // User asked a new blank page where take annotations

    // Save blank page into user's lectures list
    User.findById(userId)
      .then(user => {
        const userLecture = user.lectures.filter(l => l.uuid === lectureId)[0];

        const blankId = new ObjectId().toHexString();
        if (userLecture) {
          userLecture.screenshots.push(blankId);
        } else { // First screenshot for this lecture
          user.lectures.push({ uuid: lectureId, screenshots: [blankId] });
        }

        user.save()
          .then(() => {
            res.json({
              _id: blankId,
              fileName: 'blank',
              img: 'blank',
              name: '',
              timestamp: new Date().getTime() // TODO should be saved in db
            } as IScreenshotComplete);
          })
          .catch(err => next(err));

      })
      .catch(err => next(err));


  } else {

    // User request a real screenshot from the lecture

    LiveLectureService.getNextScreenshot(lectureId)
      .subscribe(screenshot => {

        // Save screenshot into user's lectures list
        User.findById(userId)
          .then(user => {
            const userLecture = user.lectures.filter(l => l.uuid === lectureId)[0];

            if (userLecture) {
              // TODO check if user has already the screenshot (maybe using Mongo index)
              if (userLecture.screenshots.indexOf(screenshot._id) === -1) {
                userLecture.screenshots.push(screenshot._id);
              } else {
                return res.status(400).send(
                  new ErrorResponse('no-new-screenshot', 'Current screenshot is already in user\'s screenshot list')
                );
              }
            } else { // First screenshot for this lecture
              user.lectures.push({ uuid: lectureId, screenshots: [screenshot._id] });
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
        //   {'$push': {'lectures.$.screenshots': screenshot._id}}
        // )
        //   .then(() => {
        //     return res.json(screenshot);
        //   })
        //   .catch(err => next(err));


      }, err => {
        return next(err);
      });
  }

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

  const userId = req.user.id;
  const lectureId = req.params['lectureId'];

  try {

    User.findById(userId)
      .then(user => {

        const userLecture = user.lectures.filter(l => l.uuid === lectureId)[0];

        if (!userLecture) {
          return res.status(400).send(new ErrorResponse('not-found', 'User lecture not found'));
        }

        Lecture.findOne({ uuid: lectureId })
          .then(lecture => {

            if (!lecture) {
              return res.status(400).send(new ErrorResponse('not-found', 'Lecture not found'));
            }

            Annotation.find({ userId, lectureId })
              .then((annotations: IAnnotation[] = []) => {

                // Merge user's lecture screenshots ids with extra info
                const lectureScreenshotsIds = (lecture.screenshots as Screenshot[]).map(s => s._id.toString());

                const screenshots = userLecture.screenshots.map(sId => {
                  const index = lectureScreenshotsIds.indexOf(sId);

                  if (index !== -1) {
                    return lecture.screenshots[index];
                  } else { // Blank page
                    return {
                      _id: new ObjectId(sId),
                      fileName: 'blank',
                      name: 'Blank page'
                    } as Screenshot
                  }
                });


                // Create a pdf creator and start writing on pdf sreenshots and annotations
                const creator = new PdfCreator(res, lecture.name);

                const screenshotFolderUrl = `${STORAGE_PATH}/${lecture.uuid}/${STORAGE_SLIDES_FOLDER}`;

                // For every screenshot -> one page
                (screenshots as Screenshot[]).forEach((screenshot: Screenshot, index) => {
                  const screenshotPath = screenshot.fileName === 'blank' ? null : `${screenshotFolderUrl}/${screenshot.fileName}`;

                  // Write screenshot and annotations on pdf
                  creator.addSlide(screenshotPath, annotations.filter(a => a.slideId === screenshot._id.toString()));
                });

                creator.complete();

                return;
              })
              .catch(e => next(e));

          })
          .catch(e => next(e));

      })
      .catch(err => next(err));


  } catch (err) {
    next(err);
  }
});

export { router as LectureRouter, PATH as LECTURE_PATH };
