/**
 * Representation of LODE video lecture data
 */
export interface LodeData {
    lezione: Lezione
}

interface Lezione {
    slide: Slide[],
    info: Info,
    video: Video
}

export interface Slide {
    immagine: string,
    tempo: number,
    titolo: string
}

interface Info {
    corso: string,
    dinamic_url: string,
    titolo: string,
    professore: string,
    pdf_hash: string
}

interface Video {
    nome: string,
    timestamp: Date,
    starttime: number,
    totaltime: number
}
