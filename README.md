# yux-api

Library TypeScript yang berfokus pada penyediaan tools dan scraping data dari berbagai layanan di Indonesia.

![Build Status](https://github.com/whyutams/yux-api/actions/workflows/publish.yml/badge.svg)

## ⚡ Fitur

| No  |   Nama    | Kategori |                      Deskripsi                       |                      Metode                      |
| :-: | :-------: | :------: | :--------------------------------------------------: | :----------------------------------------------: |
|  1  |   LK21    |   Film   | Pengambilan data dari layanan film **Layar Kaca 21** |  `Homepage` `Newest` `Search` `Genre` `Detail`   |
|  2  |  Komiku   |  Komik   |    Pengambilan data dari layanan komik **Komiku**    |      `Homepage` `Search` `Detail` `Chapter`      |
|  3  | Otakudesu |  Anime   |  Pengambilan data dari layanan anime **Otakudesu**   | `Homepage` `Ongoing` `Complete` `Search` `Genre` `Detail` |

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

// OR

(() => {
  // Halaman Utama
  LK21.Homepage().then((response) => {
    console.log(response.data.terbaru[0]?.title);
  });

  // Pencarian
  LK21.Search("hacksaw ridge").then((response) => {
    console.log(response.data[0]?.title);
  });

  // Pencarian berdasarkan Genre
  LK21.Genre("action").then((response) => {
    console.log(response.data[0]?.title);
  });
})();
```

## 🚀 Saran dan Masalah

Punya saran fitur atau menemukan bug? Silakan sampaikan melalui halaman [_Issues_](https://github.com/whyutams/yux-api/issues) 🔥

## 👋🏻 Penutup

Jika library ini bermanfaat, berikan dukunganmu dengan memberikan **Bintang** pada [_repository_](https://github.com/whyutams/yux-api) library ini.

Terima kasih sudah berkunjung! 🔥
