/**
 * Representation of LODE video lecture data
 */
export interface LodeData {
    data: Data
}

interface Data {
    slide: Slide[],
    info: Info,
    camvideo: Video,
    pcvideo: Video
}

export interface Slide {
    immagine: string,
    tempo: number,
    titolo: string
}

interface Info {
    course: string,
    dynamic_url: string,
    title: string,
    lecturer: string,
    timestamp: Date,
    totaltime: number,
    pdf_hash: string
}

interface Video {
    name: string,
    starttime: number,
    totaltime: number
}
