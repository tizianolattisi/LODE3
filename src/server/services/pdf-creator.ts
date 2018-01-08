import {Response} from 'express';
import {IAnnotation} from '../models/db/Annnotation';
import * as chalk from 'chalk';
import * as PDFKit from 'pdfkit';
import * as sizeOf from 'image-size';

export class PdfCreator {

  private readonly res: Response;
  private doc: PDFKit.PDFDocument;

  constructor(res: Response, title: string = '') {
    this.res = res;
    this.init(title);
  }

  private init(title: string = '') {

    // Set http respone stream content type to pdf
    this.res.set({'Content-Type': 'application/pdf'});

    // Init pdf doc
    this.doc = new PDFKit({
      autoFirstPage: false,
      info: {
        Creator: 'Lode',
        CreationDate: new Date(),
        Title: title
      }
    });
  }

  addSlide(imgPath: string, annotations: IAnnotation[]) {

    // Default sizes
    let width = 1920;
    let height = 1080;

    if (imgPath) {
      // Get page dimensions from screenshot image
      const dims = sizeOf(imgPath);
      width = dims.width;
      height = dims.height;
    }

    // Add a new page to pdf doc
    this.doc.addPage({size: [width, height]});

    // // Add screenshot to the page
    if (imgPath) {
      this.doc.image(imgPath);
    }

    // Add annotations to the page
    annotations.forEach(annotation => {
      switch (annotation.type) {

        case 'note':
          this.drawNote(annotation);
          break;

        case 'pencil':
          this.drawPencil(annotation);
          break;

        default:
          console.log(chalk.default.yellow('> Cannot draw an annotation of an unkwnown type on pdf'));
      }
    });

  }

  complete() {
    // Pipe to http stream
    this.doc.pipe(this.res);
    // End stream
    this.doc.end();
  }

  private drawNote(annotation: IAnnotation) {

    // Simply convert html text to plain text
    const text = (annotation.data.text as string).replace(/<\/?[^>]+>/ig, ' ');

    // Add note
    this.doc.note(
      annotation.data.x, annotation.data.y,
      annotation.data.x + 10, annotation.data.y + 10,
      `${annotation.data.title}\n${text}`, {
        color: annotation.data.color
      });
  }

  private drawPencil(annotation: IAnnotation) {
    this.doc.path(annotation.data.path)
      .lineWidth(annotation.data.width)
      .stroke(annotation.data.color);
  }

}
