const { selectFields } = require("express-validator/src/select-fields");
const pool = require("../config/database");
const Utils = require("../config/utils")

class Card{
    constructor(id, name){
        this.id = id;
        this.name = name;
    }

    static async getCards(game){
        try{
            let result = {
                playerCards: [],
                oppCards: 0
            };

            let [cards] = await pool.query('select * from user_game_card, card where ugc_crd_id = crd_id and ugc_ug_id = ?', [game.player.id]);
            for(let card of cards){
                result.playerCards.push(new Card(card.ugc_id, card.crd_name));
            }
            [cards] = await pool.query('select * from user_game_card, card where ugc_crd_id = crd_id and ugc_ug_id = ?', [game.opponents[0].id]);
            result.oppCards = cards.length;

            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status:500, result: err}
        }
    }

    static async drawCard(game){
        try{
            //Verify if its player's turn
            if(game.player.state == "Waiting"){
                return{status: 400, result: {msg: "You can't draw since its not your turn!"}}
            }
            //verify if player has more than 5 cards
            let [cards] = await pool.query('select * from user_game_card where ugc_ug_id = ?', [game.player.id]);
            if(cards.length >= 5){
                return{status: 400, result: {msg: "You can't have more than 5 cards!"}}
            }
            //Select a random Card
            [cards] = await pool.query('select * from card');
            let selectedCard = Utils.randomNumber(cards.length);
            //Insert into database
            await pool.query('insert into user_game_card(ugc_ug_id, ugc_crd_id) values (?,?)', [game.player.id, selectedCard]);

            return{status: 200, result: {msg: "Card Successfully Drawn!"}}
        } catch(err) {
            console.log(err)
            return{status:500, result: err}
        }
    }

    static async playCard(game, body, selectedArtifact){
        try{
            //Verify if its player's turn
            if(game.player.state == "Waiting"){
                return{status: 400, result: {msg: "You can't play since its not your turn!"}}
            }
            let [cards] = await pool.query('select * from user_game_card where ugc_ug_id = ?', [game.player.id]);
            let successful = false;
            for(let card of cards){
                if(card.ugc_id == body.selectedCard){
                    switch(card.ugc_crd_id){
                        case 1:
                            successful = await claimArtifact(game);                        
                            break;
                        case 2:
                            stealArtifact(selectedArtifact);
                            break;
                    }
                }
            }
            if(successful == false) {
                return{status:400, result: {msg: "Card not played succesfully"}}
            }
            await pool.query("delete from user_game_card where ugc_id = ?", [body.selectedCard]);
            return{status:200, result: {msg: "Card played succesfully"}}
        } catch(err) {
            console.log(err);
            return{status: 200, result:err}
        }
    }
}

async function claimArtifact(game){
    let [artifacts] = await pool.query("select * from game_artifact where ga_gm_id = ?", [game.id]);
    let successful1 = false;
    for(let artifact of artifacts){
        if(game.player.position == artifact.ga_current_position){
            await pool.query("update from game_artifact set ga_current_owner = ?" [game.player.id]);
            await pool.query("update from game_artifact set ga_current_position = null");
            successful1 = true;
        }
    } 
    return successful1;
}



async function stealArtifact(selectedArtifact){

}

module.exports = Card;