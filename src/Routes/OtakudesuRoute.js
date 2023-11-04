const express = require("express");
const router = express.Router();
const OtakudesuController = require("../Controllers/OtakudesuController");

router.get("/home", OtakudesuController.home);
router.get("/anime-list", OtakudesuController.animeList);
router.get("/ongoing/:page?", OtakudesuController.ongoing);
router.get("/anime/:id", OtakudesuController.detailAnime);
router.get("/episode/:id", OtakudesuController.epsAnime);
router.get("/episode/quality/:id", OtakudesuController.epsQuality);
router.get("/search/:query", OtakudesuController.search);

module.exports = router;
