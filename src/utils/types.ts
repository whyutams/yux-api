export type GlobalFormat = {
    /** Base URL */
    base_url: string,
    /** Base URL + Endpoint */
    url: string,
    /** Error: true/false */
    error: boolean,
    /** Data yang akan dikembalikan bisa berupa objek atau array */
    data: any | any[]
}