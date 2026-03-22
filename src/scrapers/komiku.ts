import * as cheerio from "cheerio";
import general from "../../data/general.json" with { type: "json" };
import { fetchHtml } from "../utils/fetcher.js";
import { GlobalPromise } from "../utils/types.js";

export class Api {
    private BASE_URL = general.base_url.komiku;

    /**
     * Komiku - Mengambil daftar update komik terbaru di halaman utama
     * 
     * @returns {Promise<GlobalPromise<GeneralPromise[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Homepage(): Promise<GlobalPromise<GeneralPromise[]>> {
        const endpoint = "";
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

            $("section#Terbaru .ls4w .ls4").each((i, el) => {
                let _k = $(el).find('.ls4j span.ls4s').text().trim();
                let _g = String(_k.split('  ')[0]).split(' ');
                let obj = {
                    title: $(el).find('.ls4j h3 a').text().trim(),
                    chapter: {
                        name: $(el).find('.ls4j a.ls24').text().trim(),
                        slug: $(el).find('.ls4j a.ls24').attr('href'),
                        url: this.BASE_URL + $(el).find('.ls4j a.ls24').attr('href')
                    },
                    jenis_komik: _k.split(' ')[0],
                    konsep_cerita: _g.slice(1, _g.length).join(' '),
                    updated_at: _k.split('  ')[1],
                    color: $(el).find('.warna').text().trim()?.toLowerCase().includes('warna'),
                    pict: {
                        sd: $(el).find('img').attr('src'),
                        hd: $(el).find('img').attr('src')?.split('?')[0],
                    },
                    slug: $(el).find('.ls4j h3 a').attr('href'),
                    url: this.BASE_URL + $(el).find('.ls4j h3 a').attr('href'),
                }
                main_data.data.push(obj);
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Komiku - Melakukan pencarian komik
     * 
     * @param {string} query - Kata kunci pencarian
     * @returns {Promise<GlobalPromise<PromiseSearch[]>>} Mengembalikan Promise yang berisi objek
     */
    public async Search(query: string): Promise<GlobalPromise<PromiseSearch[]>> {
        if (!query || query && query.trim().length === 0) throw new Error('Masukkan parameter query!');
        const endpoint = `/?post_type=manga&s=${query.replaceAll(' ', '+')}`;
        let main_data = {
            base_url: this.BASE_URL,
            url: this.BASE_URL + endpoint,
            error: false,
            data: [] as any[]
        };

        try {
            const html = await fetchHtml(this.BASE_URL.replace('https://', 'https://api.') + endpoint);
            if (!html) {
                main_data.error = true;
                return main_data;
            }

            const $ = cheerio.load(html);

            $("body .bge").each((i, el) => {
                let obj = {
                    title: $(el).find('.kan h3').text().trim(),
                    chapter_awal: {
                        name: $(el).find('.new1').eq(0).find('span').eq(1).text().trim(),
                        slug: $(el).find('.new1').eq(0).find('a').attr('href'),
                        url: this.BASE_URL + $(el).find('.new1').eq(0).find('a').attr('href')
                    },
                    chapter_akhir: {
                        name: $(el).find('.new1').eq(1).find('span').eq(1).text().trim(),
                        slug: $(el).find('.new1').eq(1).find('a').attr('href'),
                        url: this.BASE_URL + $(el).find('.new1').eq(1).find('a').attr('href')
                    },
                    jenis_komik: $(el).find('.tpe1_inf b').text().trim(),
                    konsep_cerita: $(el).find('.tpe1_inf')?.contents()?.filter((_, __) => __.type === 'text').text().trim() || "?",
                    updated_at: $(el).find('.kan p').text().trim()?.toLowerCase().replace('update ', ''),
                    pict: {
                        sd: $(el).find('img').attr('src'),
                        hd: $(el).find('img').attr('src')?.split('?')[0],
                    },
                    slug: $(el).find('.bgei a').attr('href'),
                    url: this.BASE_URL + $(el).find('.bgei a').attr('href'),
                }
                main_data.data.push(obj);
            });

            return main_data;
        } catch (error) {
            console.error(error);
            main_data.error = !main_data.error
            return main_data;
        }
    }

    /**
     * Komiku - Melakukan pencarian komik
     * 
     * @param {string} slug - Slug URL komik
     * @returns {Promise<GlobalPromise<PromiseDetail>>} Mengembalikan Promise yang berisi objek
     */
    public async Detail(slug: string): Promise<GlobalPromise<PromiseDetail>> {
        if (!slug || slug && slug.trim().length === 0) throw new Error('Masukkan parameter slug!');
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

            const content = $('main article');

            main_data.data = {
                title: content.find('#Judul header').text().trim(),
                title_id: content.find('#Judul p.j2').text().trim(),
                synopsis: content.find('p.desc').text().trim(),
                summary: content.find('#Sinopsis')?.contents()?.filter((_, __) => __.type === 'text').text().trim(),
                chapter_awal: {
                    name: content.find('#Judul .new1').eq(0).find('span').eq(1).text().trim(),
                    slug: content.find('#Judul .new1').eq(0).find('a').attr('href'),
                    url: this.BASE_URL + content.find('#Judul .new1').eq(0).find('a').attr('href')
                },
                chapter_akhir: {
                    name: content.find('#Judul .new1').eq(1).find('span').eq(1).text().trim(),
                    slug: content.find('#Judul .new1').eq(1).find('a').attr('href'),
                    url: this.BASE_URL + content.find('#Judul .new1').eq(1).find('a').attr('href')
                },
                chapters: [] as any[],
                jenis_komik: "?", konsep_cerita: "?", author: "?", status: "?", age: "?", cara_baca: "?",
                genres: content.find('ul.genre li').map((i, el) => {
                    return {
                        name: $(el).find('a').text().trim(),
                        slug: $(el).find('a').attr('href'),
                        url: this.BASE_URL + $(el).find('a').attr('href')
                    }
                }).get(),
                slug
            }

            content.find('section#Informasi table.inftable tr').each((i, el) => {
                let _ = $(el).find('td');
                let __ = _.eq(0).text().trim()?.toLowerCase();
                if (__.includes('jenis komik')) main_data.data.jenis_komik = _.eq(1).text().trim();
                if (__.includes('konsep cerita')) main_data.data.konsep_cerita = _.eq(1).text().trim();
                if (__.includes('pengarang')) main_data.data.author = _.eq(1).text().trim();
                if (__.includes('status')) main_data.data.status = _.eq(1).text().trim();
                if (__.includes('umur pembaca')) main_data.data.age = _.eq(1).text().trim();
                if (__.includes('cara baca')) main_data.data.cara_baca = _.eq(1).text().trim();
            });

            $('table#Daftar_Chapter tr[itemprop="itemListElement"]').each((i, el) => {
                main_data.data.chapters.push({
                    chapter: {
                        name: $(el).find('td.judulseries').find('span').text().trim(),
                        slug: $(el).find('td.judulseries').find('a').attr('href'),
                        url: this.BASE_URL + $(el).find('td.judulseries').find('a').attr('href')
                    },
                    view: $(el).find('td.pembaca').text().trim(),
                    uploaded_at: $(el).find('td.tanggalseries').text().trim()
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
     * Komiku - Mengambil daftar gambar dari chapter komik tertentu
     * 
     * @param {string} slug - Slug URL chapter komik
     * @returns {Promise<GlobalPromise<PromiseChapter>>} Mengembalikan Promise yang berisi objek
     */
    public async Chapter(slug: string): Promise<GlobalPromise<PromiseChapter>> {
        if (!slug || slug && slug.trim().length === 0) throw new Error('Masukkan parameter slug!');
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

            main_data.data = {
                title: $('#Judul h1').text().trim(),
                slug, images: []
            }

            $("#Baca_Komik img").each((i, el) => {
                main_data.data?.images.push({ url: $(el).attr('src'), alt: $(el).attr('alt'), id: $(el).attr('id') });
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
export type GeneralPromise = {
    title: string,
    chapter: {
        name: string,
        slug: string,
        url: string
    },
    jenis_komik: string,
    konsep_cerita: string,
    updated_at: string,
    color: boolean,
    pict: {
        sd: string,
        hd: string
    },
    slug: string,
    url: string,
}

export type PromiseSearch = Omit<GeneralPromise, "chapter" | "color"> & {
    chapter_awal: {
        name: string,
        slug: string,
        url: string
    };
    chapter_akhir: {
        name: string,
        slug: string,
        url: string
    };
}

export type PromiseDetail = PromiseSearch & {
    title_id: string,
    synopsis: string,
    summary: string,
    chapters: {
        name: string,
        slug: string,
        url: string
    }[],
    author: string,
    status: string,
    age: string,
    cara_baca: string,
    genres: {
        name: string,
        slug: string,
        url: string
    }[],
}

export type PromiseChapter = { title: string, slug: string, images: { url: string, alt: string, id: string }[] }
/* TYPES END */