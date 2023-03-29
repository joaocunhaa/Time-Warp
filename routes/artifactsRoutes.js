const express = require('express');
const router = express.Router();
const Artifact = require("../models/artifactsModel");
const auth = require("../middleware/auth");

router.get("/", auth.verifyAuth, async function (req, res, next) {
    try {
        // console.log("Get All the Artifacts On-Board");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" })
        } else {
            let result = await Artifact.getArtifactsInBoard(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get("/collected", auth.verifyAuth, async function (req, res, next) {
    try {
        // console.log("Get all the collected Artifacts");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" })
        } else {
            let result = await Artifact.getCollectedArtifacts(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//Cheats

router.post("/collect/cheat", auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Cheat: Collecting All the Artifacts");
        if (!req.game) {
            res.status(400).send({ msg: "You're not in a game" })
        } else {
            let result = await Artifact.collectAllArtifacts(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;