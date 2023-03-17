const express = require('express');
const router = express.Router();
const Pawn = require("../models/pawnsModel");
const auth = require("../middleware/auth");

router.get("/", auth.verifyAuth, async function(req,res,next){
    try{
        if(!req.game){
            res.status(401).send({msg: "You are not in a game"})
        }else{
            let result = await Pawn.getPawnsPositions(req.game);
            res.status(result.status).send(result.result);
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch("/", auth.verifyAuth, async function(req,res,next){
    try{
        if(!req.game){
            res.status(401).send({msg: "You are not in a game"})
        }else{
            let result = await Pawn.movePawn(req.game);
            res.status(result.status).send(result.result);
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;