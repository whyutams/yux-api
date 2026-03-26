import * as cheerio from "cheerio";
import general from "../../data/general.json" with { type: "json" };
import { fetchHtml } from "../utils/fetcher.js";
import { GlobalPromise } from "../utils/types.js";

export class Api {
    private BASE_URL = general.base_url.kbbi;

    public async cari(kata: string): Promise<GlobalPromise<GeneralPromise>> {
        const endpoint = `/entri/${kata}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: {} as any
        };

        try {
            const html = await fetchHtml(main_data.url);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);
            
            const content = $('.container');
            const defText = 'memudahkan pencarian anda melalui berbagai fitur yang hanya tersedia bagi pengguna terdaftar';

            main_data.data.title = $(content).find('h2').first().text().trim() == '' ? null : $(content).find('h2').first().text().trim();
            main_data.data.arti = $(content).find('li').eq(0).text().replace(/\s+/g, ' ').trim() == '' ? null : $(content).find('ol').first().find('li').map((i, el) => { return $(el).text().replace(/\s+/g, ' ').trim() }).get()

            if (main_data.data.arti?.find((x: string) => x.toLowerCase() != defText) && (!main_data.data.arti || !main_data.data.title)) {
                main_data.error = true;
                return main_data;
            }

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }
}

/* TYPES */
export type GeneralPromise = {
    arti: string[],
    title: string
}
/* TYPES END */