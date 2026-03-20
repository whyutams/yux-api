export type GlobalFormat = {
    /** Base URL */
    base_url: string,
    /** Base URL + Endpoint */
    url: string,
    /** Status error: true/false */
    error: boolean,
    /** @type {any | any[]} Data yang akan dikembalikan bisa berupa objek atau array */
    data: any | any[]
}