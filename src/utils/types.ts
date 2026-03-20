export type GlobalPromise<T = any | any[]> = {
    /** Base URL */
    base_url: string,
    /** Base URL + Endpoint */
    url: string,
    /** Status error: true/false */
    error: boolean,
    /** @type {any | any[]} Data yang akan dikembalikan */
    data: T
}