import * as cheerio from "cheerio";
import general from "../../data/general.json" with { type: "json" };
import { fetchHtml } from "../utils/fetcher.js";

export class Lk21 {
    private BASE_URL = general.base_url.lk21;

    /**
     * Layar kaca 21 - Halaman utama
     */
    public async Homepage(): Promise<any> {
        const endpoint = "";
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: {
                terbaru: [] as any[],
                unggulan: [] as any[],
                rekomendasi: [] as any[],
            }
        };

        try {
            const html = await fetchHtml(this.BASE_URL);
            if (!html) return [];

            const $ = cheerio.load(html);

            /* Latest */
            $(".widget[data-type='latest-movies'] ul.sliders[role='list'] li").each((i, el) => {
                let title = $(el).find("figcaption").find('h3').text().trim();
                let genre = $(el).find("figcaption").find('.genre').text().trim();
                let linkHref = $(el).find("a").attr("href") || "";
                let rating = $(el).find("span.rating").text().trim() || '?';
                let year = $(el).find("span.year").text().trim();
                let duration = $(el).find("span.duration").text().trim();
                let pict = $(el).find("picture").find("source[type='image/webp']").attr("srcset") || null;
                let pict_hd = $(el).find("picture").find("source[type='image/jpeg']").attr("srcset") || null;
                let obj = { title, genre, rating, year, duration, pict: { sd: pict, hd: pict_hd }, url: this.BASE_URL + linkHref, base_url: this.BASE_URL };
                if (title !== '') main_data.data.terbaru.push(obj);
            });

            /* Unggulan */
            $(".widget[data-type='top-series-today'] ul.sliders[role='list'] li").each((i, el) => {
                let title = $(el).find("figcaption").find('h3').text().trim();
                let genre = $(el).find("figcaption").find('.genre').text().trim();
                let linkHref = $(el).find("a").attr("href") || "";
                let rating = $(el).find("span.rating").text().trim() || '?';
                let year = $(el).find("span.year").text().trim();
                let duration = $(el).find("span.duration").text().trim();
                let pict = $(el).find("picture").find("source[type='image/webp']").attr("srcset") || null;
                let pict_hd = $(el).find("picture").find("source[type='image/jpeg']").attr("srcset") || null;
                let obj = { title, genre, rating, year, duration, pict: { sd: pict, hd: pict_hd }, url: this.BASE_URL + linkHref, base_url: this.BASE_URL };
                if (title !== '') main_data.data.unggulan.push(obj);
            });

            /* Rekomendasi */
            $(".widget[data-type]").filter((i, el) => {
                return $(el).find(".header").find("h2").text().trim() == "Rekomendasi Untukmu";
            })
                .find("ul.sliders[role='list'] li")
                .each((i, el) => {
                    let title = $(el).find("figcaption").find('h3').text().trim();
                    let genre = $(el).find("figcaption").find('.genre').text().trim();
                    let linkHref = $(el).find("a").attr("href") || "";
                    let rating = $(el).find("span.rating").text().trim() || '?';
                    let year = $(el).find("span.year").text().trim();
                    let duration = $(el).find("span.duration").text().trim();
                    let pict = $(el).find("picture").find("source[type='image/webp']").attr("srcset") || null;
                    let pict_hd = $(el).find("picture").find("source[type='image/jpeg']").attr("srcset") || null;
                    let obj = { title, genre, rating, year, duration, pict: { sd: pict, hd: pict_hd }, url: this.BASE_URL + linkHref, base_url: this.BASE_URL };
                    if (title !== '') main_data.data.rekomendasi.push(obj);
                });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Layar kaca 21 - Film terbaru
     * @param {number} page - Nomor halaman (default: 1)
     */
    public async Newest(page: number = 1): Promise<any> {
        const endpoint = `/latest${page === 1 ? "" : `/page/${page}`}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(this.BASE_URL + endpoint);
            if (!html) return [];

            const $ = cheerio.load(html);

            $(".widget .gallery-grid article").each((i, el) => {
                let title = $(el).find("figcaption").find('h3').text().trim();
                let genre = $(el).find("figcaption").find('.genre').text().trim();
                let linkHref = $(el).find("a").attr("href") || "";
                let rating = $(el).find("span.rating").text().trim() || '?';
                let year = $(el).find("span.year").text().trim();
                let duration = $(el).find("span.duration").text().trim();
                let pict = $(el).find("picture").find("source[type='image/webp']").attr("srcset") || null;
                let pict_hd = $(el).find("picture").find("source[type='image/jpeg']").attr("srcset") || null;
                let obj = { title, genre, rating, year, duration, pict: { sd: pict, hd: pict_hd }, url: this.BASE_URL + linkHref, base_url: this.BASE_URL };
                if (title !== '') main_data.data.push(obj);
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }
}