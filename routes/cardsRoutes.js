const express = require('express');
const router = express.Router();
const Card = require("../models/cardsModel");
const auth = require("../middleware/auth");
const { body, validationResult } = require('express-validator');

router.get("/", auth.verifyAuth, async function(req,res,next){
    try{
        if(!req.game){
            res.status(400).send({msg: "You're not in a game"});
        } else {
            let result = await Card.getCards(req.game);
            res.status(result.status).send(result.result);
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;