const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const querystring = require("querystring");
const baseUrl = "https://otakudesu.lol/";

exports.home = async (req, res) => {
    try {
        const response = await Axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const element = $(".venutama");
        const result = { status: true, message: "success" };
        const ongoing = [];
        const complate = [];
        let id, image, episode, day, date, title;
        element.find("> .rseries > .rapi .venz li").each(function () {
            id = $(this).find(".thumb a").attr("href").replace(`${baseUrl}anime/`, "").slice(0, -1);
            image = $(this).find(".thumb .thumbz img").attr("src");
            title = $(this).find(".thumb .jdlflm").text();
            episode = $(this).find(".detpost .epz").text().slice(1);
            day = $(this).find(".detpost .epztipe").text();
            date = $(this).find(".detpost .newnime").text();
            ongoing.push({ id, image, title, episode, day, date });
        });
        result.ongoing = ongoing;
        element.find("> .rseries > .rseries .venz li").each(function () {
            id = $(this).find(".thumb a").attr("href").replace(`${baseUrl}anime/`, "").slice(0, -1);
            image = $(this).find(".thumb .thumbz img").attr("src");
            title = $(this).find(".thumb .jdlflm").text();
            episode = $(this).find(".detpost .epz").text();
            day = $(this).find(".detpost .epztipe").text();
            date = $(this).find(".detpost .newnime").text();
            complate.push({ id, image, title, episode, day, date });
        });
        result.complate = complate;
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.animeList = async (req, res) => {
    try {
        const response = await Axios.get(`${baseUrl}anime-list`);
        const $ = cheerio.load(response.data);
        const result = { status: true, message: "success" };
        const data = [];
        let titles, abjact, id, title;
        $("#abtext")
            .find(".bariskelom")
            .each(function () {
                titles = [];
                abjact = $(this).find(".barispenz > a").text();
                $(this)
                    .find(".penzbar:not(:first)")
                    .each(function () {
                        id = $(this).find(".hodebgst").attr("href").replace(`${baseUrl}anime/`, "").slice(0, -1);
                        title = $(this).find(".hodebgst").text();
                        titles.push({ id, title });
                    });
                data.push({ abjact, titles });
            });
        result.data = data;
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.ongoing = async (req, res) => {
    const page = req.params.page || 1;
    try {
        const response = await Axios.get(`${baseUrl}ongoing-anime/page/${page}`);
        const $ = cheerio.load(response.data);
        const result = { status: true, message: "success" };
        const data = [];
        $(".venutama .venz li").each(function () {
            id = $(this).find(".thumb a").attr("href").replace(`${baseUrl}anime/`, "").slice(0, -1);
            image = $(this).find(".thumb .thumbz img").attr("src");
            title = $(this).find(".thumb .jdlflm").text();
            episode = $(this).find(".detpost .epz").text().slice(1);
            day = $(this).find(".detpost .epztipe").text();
            date = $(this).find(".detpost .newnime").text();
            data.push({ id, image, title, episode, day, date });
        });
        result.data = data;
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.search = async (req, res) => {
    const query = req.params.query;
    const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
    const result = { status: true, message: "success" };
    const data = [];
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        let genre_id, genre_title, id, image, title, status, score;
        $(".chivsrc li").each(function () {
            const genres = [];
            $(this)
                .find(".set:eq(0) a")
                .each(function () {
                    genre_id = $(this).attr("href").replace(`${baseUrl}genres/`, "").slice(0, -1);
                    genre_title = $(this).text();
                    genres.push({ genre_id, genre_title });
                });
            id = $(this).find("h2 > a").attr("href").replace(`${baseUrl}anime/`, "").slice(0, -1);
            image = $(this).find("img").attr("src");
            title = $(this).find("h2").text();
            status = $(this).find(".set:eq(1)").text().replace("Status : ", "");
            score = $(this).find(".set:eq(2)").text().replace("Rating : ", "");
            data.push({ id, image, title, status, score, genres });
        });
        result.data = data;
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.detailAnime = async (req, res) => {
    const id = req.params.id;
    const fullUrl = baseUrl + `anime/${id}`;
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".fotoanime");
        const result = { status: true, message: "success" };
        const data = {};
        const genres = [];
        const episodes = [];
        data.image = element.find("> img").attr("src");
        data.title = element.find(".infozingle p:eq(0) span").text().replace("Judul: ", "");
        data.japanese = element.find(".infozingle p:eq(1) span").text().replace("Japanese: ", "");
        data.score = element.find(".infozingle p:eq(2) span").text().replace("Skor: ", "");
        data.produser = element.find(".infozingle p:eq(3) span").text().replace("Produser: ", "");
        data.type = element.find(".infozingle p:eq(4) span").text().replace("Tipe: ", "");
        data.status = element.find(".infozingle p:eq(5) span").text().replace("Status: ", "");
        data.total_episode = element.find(".infozingle p:eq(6) span").text().replace("Total Episode: ", "");
        data.duration = element.find(".infozingle p:eq(7) span").text().replace("Durasi: ", "");
        data.release_date = element.find(".infozingle p:eq(8) span").text().replace("Tanggal Rilis: ", "");
        data.studio = element.find(".infozingle p:eq(9) span").text().replace("Studio: ", "");
        let synopsis = "";
        element.find(".sinopc p").each(function () {
            synopsis += $(this).text() + " ";
        });
        data.synopsis = synopsis;
        let genre_id, genre_name;
        element.find(".infozingle p:eq(10) span a").each(function () {
            genre_id = $(this).attr("href").replace(`${baseUrl}genres/`, "").slice(0, -1);
            genre_name = $(this).text();
            genres.push({ genre_id, genre_name });
        });
        let episode_id, episode_title, uploaded_on;
        $(".venser .episodelist:eq(1) li").each(function () {
            episode_id = $(this).find("a").attr("href").replace(`${baseUrl}episode/`, "").slice(0, -1);
            episode_title = $(this).find("a").text();
            uploaded_on = $(this).find(".zeebr").text();
            episodes.push({ episode_id, episode_title, uploaded_on });
        });
        data.genres = genres;
        data.episodes = episodes;
        result.data = data;
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.epsAnime = async (req, res) => {
    const id = req.params.id;
    const fullUrl = `${baseUrl}episode/${id}`;
    try {
        const response = await Axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $("#embed_holder");
        const result = { status: true, message: "success" };
        const m360p = [];
        const m480p = [];
        const m720p = [];
        let previous_eps, all_eps, next_eps;
        let title = $(".venutama > .posttl").text();
        if ($(".prevnext .flir a").length == 3) {
            previous_eps = $(".prevnext .flir a:eq(0)").attr("href");
            all_eps = $(".prevnext .flir a:eq(1)").attr("href");
            next_eps = $(".prevnext .flir a:eq(2)").attr("href");
        } else if ($(".prevnext .flir a[title='Episode Sebelumnya']").length == 1) {
            previous_eps = $(".prevnext .flir a[title='Episode Sebelumnya']").attr("href");
            all_eps = $(".prevnext .flir a:eq(1)").attr("href");
        } else {
            all_eps = $(".prevnext .flir a:eq(0)").attr("href");
            next_eps = $(".prevnext .flir a[title='Episode Selanjutnya']").attr("href");
        }
        previous_eps = previous_eps ? previous_eps.replace(`${baseUrl}episode/`, "").slice(0, -1) : previous_eps;
        all_eps = all_eps ? all_eps.replace(`${baseUrl}anime/`, "").slice(0, -1) : all_eps;
        next_eps = next_eps ? next_eps.replace(`${baseUrl}episode/`, "").slice(0, -1) : next_eps;
        let url_stream = element.find("iframe").attr("src");
        let resolution_id, media_player;
        element.find(".mirrorstream > .m360p > li").each(function () {
            resolution_id = $(this).find("a").attr("data-content");
            media_player = $(this).find("a").text();
            m360p.push({ quality: 360, resolution_id, media_player });
        });
        element.find(".mirrorstream > .m480p > li").each(function () {
            resolution_id = $(this).find("a").attr("data-content");
            media_player = $(this).find("a").text();
            m480p.push({ quality: 480, resolution_id, media_player });
        });
        element.find(".mirrorstream > .m720p > li").each(function () {
            resolution_id = $(this).find("a").attr("data-content");
            media_player = $(this).find("a").text();
            m720p.push({ quality: 720, resolution_id, media_player });
        });
        result.data = { title, previous_eps, all_eps, next_eps, url_stream, m360p, m480p, m720p };
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.epsQuality = async (req, res) => {
    const id = req.params.id;
    const url = `${baseUrl}wp-admin/admin-ajax.php`;
    const result = { status: true, message: "success" };
    try {
        const getNonce = await axiosPost(url, "action=aa1208d27f29ca340c92c66d1926f13f");
        const conten = JSON.parse(Buffer.from(id, "base64").toString("utf8"));
        const getStream = await axiosPost(url, querystring.stringify({ id: conten.id, i: conten.i, q: conten.q, nonce: getNonce.data, action: "2a3505c93b0035d3f455df82bf976b84" }));
        let respon = Buffer.from(getStream["data"], "base64").toString("utf8");
        const $ = cheerio.load(respon);
        let quality = conten.q;
        let url_stream = $("iframe").attr("src");
        result.data = { quality, url_stream };
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

function axiosPost(url, data) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    return new Promise((resolve, reject) => {
        Axios.post(url, data, headers)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
