const express = require('express');
const router = express.Router();
const Pawn = require("../models/pawnsModel");
const auth = require("../middleware/auth");

router.get("/", auth.verifyAuth, async function (req, res, next) {
    try {
        // console.log("Get Pawns Positions");
        if (!req.game) {
            res.status(401).send({ msg: "You are not in a game" })
        } else {
            let result = await Pawn.getPawnsPositions(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch("/", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Move Pawn");
        if (!req.game) {
            res.status(401).send({ msg: "You are not in a game" })
        } else {
            let result = await Pawn.movePawn(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch("/surrend", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Surrend");
        if (!req.game) {
            res.status(401).send({ msg: "You are not in a game" })
        } else {
            let result = await Pawn.surrender(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;