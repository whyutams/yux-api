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
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            /* Latest */
            $(".widget[data-type='latest-movies'] ul.sliders[role='list'] li").each((i, el) => {
                let obj = this.convertHtmlContent($, el);
                if (obj.title !== '') main_data.data.terbaru.push(obj);
            });

            /* Unggulan */
            $(".widget[data-type='top-series-today'] ul.sliders[role='list'] li").each((i, el) => {
                let obj = this.convertHtmlContent($, el);
                if (obj.title !== '') main_data.data.unggulan.push(obj);
            });

            /* Rekomendasi */
            $(".widget[data-type]").filter((i, el) => {
                return $(el).find(".header").find("h2").text().trim() == "Rekomendasi Untukmu";
            })
                .find("ul.sliders[role='list'] li")
                .each((i, el) => {
                    let obj = this.convertHtmlContent($, el);
                    if (obj.title !== '') main_data.data.rekomendasi.push(obj);
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
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $(".widget .gallery-grid article").each((i, el) => {
                let obj = this.convertHtmlContent($, el);
                if (obj.title !== '') main_data.data.push(obj);
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Layar kaca 21 - Cari Film
     * @param {string} query - Kata kunci pencarian
     * @param {number} page - Halaman pencarian (default: 1)
     */
    public async Search(query: string, page: number = 1): Promise<any> {
        const endpoint = `/search?s=${encodeURIComponent(query)}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(this.BASE_URL);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);
            const search_url = $("body").attr("data-search_url");
            const thumbnail_url = $("body").attr("data-thumbnail_url") || "https://static-jpg.lk21.party/wp-content/uploads/";
            if (!search_url) {
                console.error("API URL tidak ditemukan");
                main_data.error = true;
                return main_data;
            }

            const apiUrl = `${search_url}search.php?s=${encodeURIComponent(query)}&page=${page}`;
            const response = await fetchHtml(apiUrl, this.BASE_URL) as any
            if (!response || response.error || !response.data || response.data.length === 0) {
                main_data.error = true;
                return main_data;
            }

            main_data.data = response.data.map((item: any) => {
                const poster = item.poster ? thumbnail_url + item.poster : null;
                let obj = { title: item.title, rating: item.rating ? String(item.rating) : "?", year: item.year ? String(item.year) : "?", duration: item.runtime == "" ? "?" : item.runtime, season: item.season != "" ? `S.${item.season}` : "?", episode: item.episode == "" ? "1" : String(item.episode), pict: { sd: poster, hd: poster }, url: `${this.BASE_URL}/${item.slug}`, base_url: this.BASE_URL };
                return obj;
            });

            return main_data;
        } catch (error: any) {
            console.error(error);
            main_data.error = true;
            return main_data;
        }
    }

    /**
     * Layar kaca 21 - Cari Film berdasarkan genre
     * @param {string} genre - Genre 
     */
    public async SearchByGenre(genre: string): Promise<any> {
        const endpoint = `/ajax/filter-recommendation`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            let params = new URLSearchParams();
            params.append("type", "");
            params.append("genre1", genre);
            params.append("genre2", "");
            params.append("country", "");
            params.append("years", "");
            params.append("artist", "");

            const apiUrl = this.BASE_URL + endpoint;
            const html = await fetchHtml(apiUrl, this.BASE_URL, params);

            if (!html || typeof html !== "string") {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $("article").each((i, el) => {
                let obj = this.convertHtmlContent($, el);
                if (obj.title !== '') main_data.data.push(obj);
            });

            return main_data;

        } catch (error: any) {
            console.error(error);
            main_data.error = true;
            return main_data;
        }
    }

    /* FUNCTIONS */
    private convertHtmlContent($: cheerio.CheerioAPI, el: any): any {
        let title = $(el).find("figcaption").find('h3').text().trim() || $(el).find("a").attr("title") || "";
        let genre = $(el).find("figcaption").find('.genre').text().trim();
        let linkHref = $(el).find("a").attr("href") || "";
        let rating = $(el).find("span.rating").text().trim() || '?';
        let year = $(el).find("span.year").text().trim();
        let duration = $(el).find("span.duration").text().trim();
        let episode = $(el).find("span.episode").find("strong").text().trim() || "1";
        let pict = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || null;
        if (linkHref && linkHref.startsWith("/")) linkHref = this.BASE_URL + linkHref;
        let obj = { title, genre, rating, year, duration: duration.startsWith("S.") ? "?" : duration, season: !duration.startsWith("S.") ? "?" : duration, episode, pict: { sd: pict, hd: pict }, url: linkHref, base_url: this.BASE_URL };
        return obj;
    }
}