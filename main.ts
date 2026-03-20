import * as lk21Scraper from "./src/scrapers/lk21.js"; 

/**
 * Film - Layar Kaca 21
 * * @method Homepage Mengambil data konten untuk halaman utama
 * @method Newest Mengambil data konten untuk halaman film terbaru
 * @method Search Melakukan pencarian film berdasarkan kata kunci
 * @method Genre Mengambil daftar film berdasarkan genre
 * @method Detail Mengambil seluruh informasi film tertentu
 */
export const LK21 = new lk21Scraper.Lk21();