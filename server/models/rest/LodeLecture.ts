import {LODE_BASE_URL} from "../../commons/config";
import {Slide as LodeSlide}  from "./LodeData";

const IMG_PATTERN = /img\/(\d+)\.png/;

/**
 * Lecture data implementation
 */
export default class Lecture implements LodeLecture {

    information: Information;
    video: Video;
    slides: Slide[];

    private static getPageFromThumbnail(relUrl: string): number {
        let match = relUrl.match(IMG_PATTERN);
        return (match) ? (parseInt(match[1])) : (0);
    }

    private static getThumbnailAbsoluteUrl(course: string, lecture: string, relUrl: string): string {
        return LODE_BASE_URL + '/' + course + '/' + lecture + '/content/' + relUrl;
    }

    addSlide(course: string, lecture: string, slide: LodeSlide) {
        if (!this.slides) {
            this.slides = [];
        }
        this.slides.push({
            page: Lecture.getPageFromThumbnail(slide.immagine),
            title: slide.titolo,
            thumbnailUrl: Lecture.getThumbnailAbsoluteUrl(course, lecture, slide.immagine),
            time: slide.tempo
        });
    }
}

/**
 * Model of LODE data served from server
 */
export interface LodeLecture {

    information: Information,
    video: Video,
    slides: Slide[]
}

interface Information {
    course: string,
    title: string,
    professor: string
}

interface Video {
    url: string,
    start: Date,
    duration: number
}

interface Slide {
    page: number,
    thumbnailUrl: string,
    title: string,
    time: number
}