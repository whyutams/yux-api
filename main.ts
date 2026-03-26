import * as scraperLk21 from "./src/scrapers/lk21.js";
import * as scraperKomiku from "./src/scrapers/komiku.js";
import * as scraperOtakudesu from "./src/scrapers/otakudesu.js";
import * as scraperKBBI from "./src/scrapers/kbbi.js";

/**
 * Film - Layar Kaca 21
 * @method Homepage Mengambil data konten untuk halaman utama
 * @method Newest Mengambil data konten untuk halaman film terbaru
 * @method Search Melakukan pencarian film berdasarkan kata kunci
 * @method Genre Mengambil daftar film berdasarkan genre
 * @method Detail Mengambil seluruh informasi film tertentu
 */
export const LK21 = new scraperLk21.Api();

/**
 * Komik - Komiku
 * @method Homepage Mengambil daftar update komik terbaru di halaman utama
 * @method Search Melakukan pencarian komik
 * @method Detail Mengambil informasi detail komik
 * @method Chapter Mengambil daftar gambar dari chapter komik tertentu
 */
export const Komiku = new scraperKomiku.Api();

/**
 * Anime - Otakudesu
 * @method Homepage Mengambil daftar update anime Complete & Ongoing terbaru di halaman utama 
 * @method Ongoing Mengambil data konten untuk anime yang sedang tayang
 * @method Complete Mengambil data konten untuk anime yang sudah selesai tayang
 * @method Search Melakukan pencarian anime
 * @method Genre Mengambil data konten untuk anime dengan genre tertentu
 * @method Detail Mengambil seluruh informasi anime tertentu
 */
export const Otakudesu = new scraperOtakudesu.Api();

const insKBBI = new scraperKBBI.Api();
/**
 * Pustaka - Kamus Besar Bahasa Indonesia
 * @param {string} kata - Kata pencarian
 * @returns {Promise<GlobalPromise<import("./src/scrapers/kbbi.js").GeneralPromise>>} Mengembalikan Promise yang berisi objek
 */
export const KBBI = insKBBI.cari.bind(insKBBI);