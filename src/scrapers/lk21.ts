import * as cheerio from "cheerio";
import general from "../../data/general.json" with { type: "json" };
import { fetchHtml } from "../utils/fetcher.js";
import { GlobalFormat } from "../utils/types.js";

export class Lk21 {
    private BASE_URL = general.base_url.lk21;

    /**
     * Layar kaca 21 - Mengambil data konten untuk halaman utama
     * 
     * @returns {Promise<GlobalFormat<{terbaru: GeneralPromise[], unggulan: GeneralPromise[], rekomendasi: GeneralPromise[]}>>} Mengembalikan Promise yang berisi objek
     */
    public async Homepage(): Promise<GlobalFormat<{ terbaru: GeneralPromise[], unggulan: GeneralPromise[], rekomendasi: GeneralPromise[] }>> {
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
     * Layar kaca 21 - Mengambil data konten untuk halaman film terbaru
     * 
     * @param {number} page - Nomor halaman (default: 1)
     * @returns {Promise<GlobalFormat<GeneralPromise[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Newest(page: number = 1): Promise<GlobalFormat<GeneralPromise[]>> {
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
     * Layar kaca 21 - Melakukan pencarian film berdasarkan kata kunci
     * 
     * @param {string} query - Kata kunci pencarian
     * @param {number} page - Halaman pencarian (default: 1)
     * @returns {Promise<GlobalFormat<GeneralPromise[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Search(query: string, page: number = 1): Promise<GlobalFormat<GeneralPromise[]>> {
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
                let obj = { title: item.title, genre: '?', rating: item.rating ? String(item.rating) : "?", year: item.year ? String(item.year) : "?", duration: item.runtime == "" ? "?" : item.runtime, season: item.season != "" ? `S.${item.season}` : "?", episode: item.episode == "" ? "1" : String(item.episode), pict: { sd: poster, hd: poster }, slug: String(item.slug).startsWith('/') ? item.slug : `/${item.slug}`, url: `${this.BASE_URL}/${item.slug}`, base_url: this.BASE_URL };
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
     * Layar kaca 21 - Mengambil daftar film berdasarkan genre
     * 
     * @param {Genres} genre - Genre 
     * @returns {Promise<GlobalFormat<GeneralPromise[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Genre(genre: Genres): Promise<GlobalFormat<GeneralPromise[]>> {
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

    /**
     * Layar kaca 21 - Mengambil seluruh informasi film tertentu
     * 
     * @param {string} slug - URL film
     * @returns {Promise<GlobalFormat<DetailPromise>>} Mengembalikan Promise yang berisi objek
     */
    public async Detail(slug: string): Promise<GlobalFormat<DetailPromise>> {
        const endpoint = slug.startsWith('/') ? slug : `/${slug}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: {} as any
        };

        try {
            const html = await fetchHtml(this.BASE_URL + endpoint);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);
            const content = $(".movie-info");

            let title, synopsis, age = "?", quality = "?", duration = "?", sutradara: any = [], artists: any = [], negara: any = [], releaseDate = "?", updatedAt = "?", downloadUrl, pict, rating = "?", votes, genres: any = [];

            title = content.find('h1').first().text().trim();
            content.find('.info-tag span').each((i, el) => {
                let _ = $(el).text().trim();
                let __ = _.toLowerCase();
                if (__.endsWith('+')) age = _;
                else if (__.endsWith('p')) quality = _;
                else if (__.endsWith('m') && __[1] == "h") duration = _;
                else if (__.includes(".")) rating = _;
            });
            downloadUrl = content.find('.movie-action a[target="_blank"]').first().attr('href');
            synopsis = content.find('.meta-info .synopsis').text().trim();
            pict = content.find('.meta-info .detail a').last().attr('href');
            content.find('.meta-info .detail p').each((i, el) => {
                let _ = $(el).text().trim();
                let __ = _.toLowerCase();

                if (__.startsWith('sutradara')) {
                    $(el).find("a").each((_i, _el) => {
                        let _: any = { name: $(_el).text().trim(), slug: $(_el).attr('href'), url: this.BASE_URL + $(_el).attr('href') };
                        sutradara.push(_);
                    });
                }
                if (__.startsWith('bintang film')) {
                    $(el).find("a").each((_i, _el) => {
                        let _: any = { name: $(_el).text().trim(), slug: $(_el).attr('href'), url: this.BASE_URL + $(_el).attr('href') };
                        artists.push(_);
                    });
                }
                if (__.startsWith('negara')) {
                    $(el).find("a").each((_i, _el) => {
                        let _: any = { name: $(_el).text().trim(), slug: $(_el).attr('href'), url: this.BASE_URL + $(_el).attr('href') };
                        negara.push(_);
                    });
                }
                if (__.startsWith('release')) {
                    releaseDate = _.replace(/release\s*:/i, '').trim() || "?";
                }
                if (__.startsWith('updated')) {
                    updatedAt = _.replace(/updated\s*:/i, '').trim() || "?";
                }
                if (__.startsWith('votes')) {
                    votes = _.replace(/votes\s*:/i, '').trim() || "?";
                }
            });
            content.find(".tag-list span.tag").each((i, el) => {
                let _: any = { name: $(el).text().trim(), slug: $(el).find('a').attr('href'), url: this.BASE_URL + $(el).find('a').attr('href') };
                genres.push(_);
            });

            main_data.data = { title, synopsis, genres, rating, age, quality, duration, votes, download_url: downloadUrl, pict: { sd: pict, hd: pict }, sutradara, artists, release_date: releaseDate, updated_at: updatedAt, year: '?', episode: '?', season: '?', url: main_data.url, slug, base_url: this.BASE_URL }

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error;
            return main_data;
        }
    }

    /* FUNCTIONS */
    private convertHtmlContent($: cheerio.CheerioAPI, el: any): any {
        let title = $(el).find("figcaption").find('h3').text().trim() || $(el).find("a").attr("title") || "";
        let genre = $(el).find("figcaption").find('.genre').text().trim();
        let linkHref = $(el).find("a").attr("href") || "";
        let slug = linkHref;
        let rating = $(el).find("span.rating").text().trim() || '?';
        let year = $(el).find("span.year").text().trim();
        let duration = $(el).find("span.duration").text().trim();
        let episode = $(el).find("span.episode").find("strong").text().trim() || "1";
        let pict = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || null;
        if (linkHref && linkHref.startsWith("/")) linkHref = this.BASE_URL + linkHref;
        let obj = { title, genre, rating, year, duration: duration.startsWith("S.") ? "?" : duration, season: !duration.startsWith("S.") ? "?" : duration, episode, pict: { sd: pict, hd: pict }, slug, url: linkHref, base_url: this.BASE_URL };
        return obj;
    }
}

/* Last updated on 19/03/2026 */
export type Genres = "action" | "adventure" | "animation" | "biography" | "comedy" | "crime" | "documentary" | "drama" | "family" | "fantasy" | "film-noir" | "game-show" | "history" | "horror" | "musical" | "mystery" | "psychological" | "reality-tv" | "romance" | "sci-fi" | "short" | "sport" | "supernatural" | "tv-movie" | "talk" | "thriller" | "war" | "western" | "wrestling";

export type GeneralPromise = {
    title: string,
    genre: string,
    rating: string,
    year: string,
    duration: string,
    season: string,
    episode: string,
    pict: {
        sd: string,
        hd: string
    },
    slug: string,
    url: string,
    base_url: string,
}

export type DetailPromise = {
    title: string,
    synopsis: string,
    genres: {
        name: string,
        slug: string,
        url: string
    }[],
    rating: string,
    age: string,
    quality: string,
    duration: string,
    year: string,
    votes: string,
    download_url: string,
    sutradara: {
        name: string,
        slug: string,
        url: string
    }[],
    artists: {
        name: string,
        slug: string,
        url: string
    }[],
    pict: {
        sd: string,
        hd: string
    },
    release_date: string,
    updated_at: string,
    season: string,
    episode: string,
    slug: string,
    url: string,
    base_url: string,
}