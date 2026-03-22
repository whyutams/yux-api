/**
 * Film - Layar Kaca 21
 * @method Homepage Mengambil data konten untuk halaman utama
 * @method Newest Mengambil data konten untuk halaman film terbaru
 * @method Search Melakukan pencarian film berdasarkan kata kunci
 * @method Genre Mengambil daftar film berdasarkan genre
 * @method Detail Mengambil seluruh informasi film tertentu
 */
import * as scraperLk21 from "./src/scrapers/lk21.js";
export const LK21 = new scraperLk21.Api();

/**
 * Komik - Komiku
 * @method Homepage Mengambil daftar update komik terbaru di halaman utama
 * @method Search Melakukan pencarian komik
 * @method Detail Mengambil informasi detail komik
 * @method Chapter Mengambil daftar gambar dari chapter komik tertentu
 */
import * as scraperKomiku from "./src/scrapers/komiku.js";
export const Komiku = new scraperKomiku.Api();
