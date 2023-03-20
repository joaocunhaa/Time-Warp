const express = require('express');
const router = express.Router();
const Artifact = require("../models/artifactsModel");
const auth = require("../middleware/auth");
const { body, validationResult } = require('express-validator');

router.get("/", auth.verifyAuth, async function(req, res, next){
    try{
        if(!req.game){
            res.status(400).send({msg: "You're not in a game"})
        } else {
            let result = await Artifact.getArtifactsInBoard(req.game);
            res.status(result.status).send(result.result);
        }
    } catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get("/player", auth.verifyAuth, body("player_id").isInt({min: 1}).withMessage('Select a valid player') , async function(req, res, next){
    try{
        if(!req.game){
            res.status(400).send({msg: "You're not in a game"})
        } else {
            //verify if we have a player_id
            const valid = validationResult(req);
            if(!valid.isEmpty()){
                return res.status(400).json(valid.array());
            }

            let result = await Artifact.getPlayerArtifacts(req.game, req.body.player_id);
            res.status(result.status).send(result.result);
        }
    } catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;