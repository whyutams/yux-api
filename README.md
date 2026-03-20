# yux-api

Library TypeScript yang berfokus pada scraping data dari berbagai layanan secara cepat dan efisien. Dibangun menggunakan Axios dan Cheerio.

![Build Status](https://github.com/whyutams/yux-api/actions/workflows/publish.yml/badge.svg)

## ⚡ Fitur

| No  | Nama | Kategori |                Deskripsi                |               Metode               |
| :-: | :--: | :-----: | :-------------------------------------: | :----------------------------------: |
|  1  | LK21 | Film | Pengambilan data dari layanan film Layar Kaca 21 | `Homepage` `Newest` `Search` `Genre` `Detail` |


## 📦 Instalasi

[![NPM INSTALL](http://img.shields.io/badge/npm-install-blue.svg?style=flat&logo=npm)](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) ![NODE JS](http://img.shields.io/badge/Node-JS-teal.svg?style=flat&logo=node.js)

Gunakan npm untuk menginstal library ini:

```bash
$ npm install yux-api
```

## 🛠️ Penggunaan

Contoh penggunaan kode untuk fitur LK21:

```js
import { LK21 } from "yux-api";
// OR
// const { LK21 } = await import("yux-api");

(async () => {
  // Halaman Utama
  const home = await LK21.Homepage();
  console.log(home.data.terbaru[0]?.title);

  // Pencarian
  const search = await LK21.Search("hacksaw ridge");
  console.log(search.data[0]?.title);

  // Pencarian berdasarkan Genre
  const genreAction = await LK21.Genre("action");
  console.log(genreAction.data[0]?.title);
})();
```

## 👋🏻 Terima Kasih

Terima kasih sudah berkunjung!
