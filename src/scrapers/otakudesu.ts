import * as cheerio from "cheerio";
import general from "../../data/general.json" with { type: "json" };
import { fetchHtml } from "../utils/fetcher.js";
import { GlobalPromise } from "../utils/types.js";

export class Api {
    private BASE_URL = general.base_url.otakudesu;

    /**
     * Otakudesu - Mengambil daftar update anime Complete & Ongoing terbaru di halaman utama
     * 
     * @returns {Promise<GlobalPromise<{ ongoing: GeneralPromise[], complete: GeneralPromise[]}>>} Mengembalikan Promise yang berisi objek
     */
    public async Homepage(): Promise<GlobalPromise<{ ongoing: GeneralPromise[], complete: PromiseComplete[] }>> {
        const endpoint = "";
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: {
                ongoing: [] as any[],
                complete: [] as any[],
            }
        };

        try {
            const html = await fetchHtml(this.BASE_URL);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $('.rseries').first().find('.venz ul li').each((i, el) => {
                main_data.data.ongoing.push({
                    title: $(el).find('h2.jdlflm').text().trim(),
                    episode: Number($(el).find('.epz').text().trim().replace('Episode ', '')),
                    updated_at: $(el).find('.newnime').text().trim(),
                    jadwal_tayang: $(el).find('.epztipe').text().trim().replace("None", '?'),
                    pict: $(el).find('.thumbz img').attr('src'),
                    slug: $(el).find('a[data-wpel-link="internal"]').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('a[data-wpel-link="internal"]').attr('href'),
                });
            });

            $('.rseries').eq(1).find('.venz ul li').each((i, el) => {
                let _ = $(el).find('.epztipe').text().trim();
                main_data.data.complete.push({
                    title: $(el).find('h2.jdlflm').text().trim(),
                    total_episode: Number($(el).find('.epz').text().trim().replace(' Episode', '')),
                    updated_at: $(el).find('.newnime').text().trim(),
                    rating: Number(_[0]) ? _ : null,
                    musim: Number(_[0]) ? null : _,
                    pict: $(el).find('.thumbz img').attr('src'),
                    slug: $(el).find('a[data-wpel-link="internal"]').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('a[data-wpel-link="internal"]').attr('href'),
                });
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Otakudesu - Mengambil data konten untuk anime yang sedang tayang
     * 
     * @param {number} page - Nomor halaman (default: 1)
     * @returns {Promise<GlobalPromise<GeneralPromise[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Ongoing(page?: number): Promise<GlobalPromise<GeneralPromise[]>> {
        const endpoint = `/ongoing-anime/${page ? `page/${page}/` : ''}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(main_data.url);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $('.rseries .venz ul li').each((i, el) => {
                main_data.data.push({
                    title: $(el).find('h2.jdlflm').text().trim(),
                    episode: Number($(el).find('.epz').text().trim().replace("Episode ", '')),
                    updated_at: $(el).find('.newnime').text().trim(),
                    jadwal_tayang: $(el).find('.epztipe').text().trim().replace("None", '?'),
                    pict: $(el).find('.thumbz img').attr('src'),
                    slug: $(el).find('a[data-wpel-link="internal"]').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('a[data-wpel-link="internal"]').attr('href'),
                });
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Otakudesu - Mengambil data konten untuk anime yang sudah selesai tayang
     * 
     * @param {number} page - Nomor halaman (default: 1)
     * @returns {Promise<GlobalPromise<PromiseComplete[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Complete(page?: number): Promise<GlobalPromise<PromiseComplete[]>> {
        const endpoint = `/complete-anime/${page ? `page/${page}/` : ''}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(main_data.url);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $('.rseries .venz ul li').each((i, el) => {
                let _ = $(el).find('.epztipe').text().trim();
                main_data.data.push({
                    title: $(el).find('h2.jdlflm').text().trim(),
                    total_episode: Number($(el).find('.epz').text().trim().replace(' Episode', '')),
                    updated_at: $(el).find('.newnime').text().trim(),
                    rating: Number(_[0]) ? _ : null,
                    musim: Number(_[0]) ? null : _,
                    pict: $(el).find('.thumbz img').attr('src'),
                    slug: $(el).find('a[data-wpel-link="internal"]').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('a[data-wpel-link="internal"]').attr('href'),
                });
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Otakudesu - Melakukan pencarian anime
     * 
     * @param {string} query - Kata kunci pencarian 
     * @returns {Promise<GlobalPromise<PromiseSearch[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Search(query: string): Promise<GlobalPromise<PromiseSearch[]>> {
        if (!query || query && query.trim().length === 0) throw new Error('Masukkan parameter query!');
        const endpoint = `/?s=${query.replaceAll(" ", "+")}&post_type=anime`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(main_data.url);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $('ul.chivsrc li').each((i, el) => {
                let t = $(el).find('h2 a[data-wpel-link="internal"]').text().trim();
                let bt = t.includes("(") && t.includes(")");
                let _te = t.split("(")[1]?.split(")")[0]?.toLowerCase().replace(")", "").replace("episode 1 – ", '') || "";
                let te = bt ? isNaN(Number(_te)) ? null : Number(_te) : null;
                let r = null, m = null, s = null, gs = [] as any[], is_ova;
                is_ova = !!t.includes("OVA");
                $(el).find('.set').each((_i, _el) => {
                    let _ = $(_el);
                    let __ = $(_el).find('b').text().trim();

                    if (__.toLowerCase().includes('rating')) {
                        let x = _.contents()?.filter((x, _x) => _x.type === 'text').text().trim();
                        if (x == ' : ') s = null; else {
                            x = x.replace(":", '').trim();
                            let _x = Number(x[0]);
                            if (_x) r = x; else m = x;
                        }
                    }

                    if (__.toLowerCase().includes('status')) {
                        let x = _.contents()?.filter((x, _x) => _x.type === 'text').text().trim();
                        if (x == ' : ') s = null; else s = x.replace(":", '').trim();
                    }

                    if (__.toLowerCase().includes('genres')) {
                        $(_el).find('a[rel="tag"]').each((__i, __el) => {
                            gs.push({
                                genre: $(__el).text().trim(),
                                slug: $(__el).attr('href')?.replace(this.BASE_URL, ''),
                                url: $(__el).attr('href'),
                            });
                        });
                    }
                });

                main_data.data.push({
                    title: t, total_episode: te, rating: r, musim: m, status: s, genres: gs, is_ova,
                    pict: $(el).find('img.attachment-post-thumbnail').attr('src'),
                    slug: $(el).find('a[data-wpel-link="internal"]').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('a[data-wpel-link="internal"]').attr('href'),
                });
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }

    }

    /**
     * Otakudesu - Mengambil data konten untuk anime dengan genre tertentu
     * 
     * @param {Genres} genre - Genre
     * @param {number} page - Nomor halaman (default: 1)
     * @returns {Promise<GlobalPromise<PromiseGenre[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Genre(genre: Genres, page?: string): Promise<GlobalPromise<PromiseGenre[]>> {
        if (!genre || genre && genre.trim().length === 0) throw new Error('Masukkan parameter genre!');
        const endpoint = `/genres/${genre}/${page ? `page/${page}` : ''}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(main_data.url);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $('.page .col-anime-con').each((i, el) => {
                let te = $(el).find('.col-anime-eps').text().trim();
                main_data.data.push({
                    title: $(el).find('.col-anime-title a').text().trim(),
                    synopsis: $(el).find('.col-synopsis').text().trim() || null,
                    studio: $(el).find('.col-anime-studio').text().trim() || null,
                    total_episode: (isNaN(Number(te?.replace(' Eps', ''))) ? te?.replace("Unknown Eps", "?") : Number(te?.replace(' Eps', ''))) || null,
                    musim: $(el).find('.col-anime-date').text().trim() || null,
                    rating: $(el).find('.col-anime-rating').text().trim() || null,
                    genres: $(el).find('.col-anime-genre a').map((_, __) => {
                        return { genre: $(__).text().trim(), slug: $(__).attr('href')?.replace(this.BASE_URL, ''), url: $(__).attr('href') }
                    }).get(),
                    pict: $(el).find('.col-anime-cover img').attr('src') || null,
                    slug: $(el).find('.col-anime-title a').attr('href')?.replace(this.BASE_URL, ''),
                    url: $(el).find('.col-anime-title a').attr('href'),
                });
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }

    }
}

/* TYPES */
type Genres = "action" | "adventure" | "comedy" | "demons" | "drama" | "ecchi" | "fantasy" | "game" | "harem" | "historical" | "horror" | "josei" | "magic" | "martial-arts" | "mecha" | "military" | "music" | "mystery" | "psychological" | "parody" | "police" | "romance" | "samurai" | "school" | "sci-fi" | "seinen" | "shoujo" | "shoujo-ai" | "shounen" | "slice-of-life" | "sports" | "space" | "super-power" | "supernatural" | "thriller" | "vampire";

type GeneralPromise = {
    title: string,
    episode: string,
    updated_at: string,
    jadwal_tayang: string,
    pict: string,
    slug: string,
    url: string,
}

type PromiseComplete = Omit<GeneralPromise, 'jadwal_tayang' | 'episode'> & {
    total_episode: string,
    rating?: string,
    musim?: string,
}

type PromiseSearch = Omit<GeneralPromise, 'jadwal_tayang' | 'episode' | 'updated_at'> & {
    total_episode?: number,
    rating?: string,
    musim?: string,
    status: string,
    genres: {
        genre: string,
        slug: string,
        url: string
    }[],
    is_ova: boolean,
}

type PromiseGenre = Omit<GeneralPromise, 'jadwal_tayang' | 'episode' | 'updated_at'> & {
    total_episode?: number,
    rating?: string,
    studio?: string,
    synopsis?: string,
    musim?: string,
    genres: {
        genre: string,
        slug: string,
        url: string
    }[],
}
/* TYPES END */