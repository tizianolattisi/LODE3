/**
 * Information stored in pdf cache
 */
export interface PdfCache {
    url: string // original pdf location
    hash: string // pdf hash
    data: Buffer, // pdf file bytes
}