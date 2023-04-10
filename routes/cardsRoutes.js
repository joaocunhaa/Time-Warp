const express = require('express');
const router = express.Router();
const Card = require("../models/cardsModel");
const auth = require("../middleware/auth");

router.get("/", auth.verifyAuth, async function (req, res, next) {
    try {
        // console.log("Get all the player cards");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.getCards(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/draw", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Draw a new card");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.drawCard(req.game, false, null);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch("/play", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play a Card");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.playCard(req.game, req.body);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete("/drop", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Drop a card");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.dropCard(req.game, false, req.body);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//Cheats

router.post("/draw/cheat", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Cheat: Draw an specific card");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.drawCard(req.game, true, req.body);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete("/drop/cheat", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Cheat: Drop All Cards");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" });
        } else {
            let result = await Card.dropCard(req.game, true, null);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;