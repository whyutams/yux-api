import * as fetcher from "./main.ts";

/* Tester */
(async () => {
    const data = await fetcher.lk21.Homepage();
    console.log(JSON.stringify(data));
})();