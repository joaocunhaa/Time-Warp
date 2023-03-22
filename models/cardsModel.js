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
            //Get all the cards of the player
            let [cards] = await pool.query('select * from user_game_card, card where ugc_crd_id = crd_id and ugc_ug_id = ?', [game.player.id]);
            for(let card of cards){
                result.playerCards.push(new Card(card.ugc_id, card.crd_name));
            }
            //Get the amount of cards that the opponent has
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

    static async playCard(game, body){
        try{
            let successfull = {result: false, msg: null};
            //Verify if its player's turn
            if(game.player.state == "Waiting"){
                return{status: 400, result: {msg: "You can't play since its not your turn!"}}
            }

            let [cards] = await pool.query('select * from user_game_card where ugc_id = ?', [body.selected_card]);
            //Verify if the card exists
            if(!cards.length){
                return{status: 400, result: {msg: "Select a valid card!"}}
            }
            //Get the type of card and do the respective action
            switch(cards[0].ugc_crd_id){
                case 1:
                    successfull = await claimArtifact(game); 
                    break;
                case 2:
                    successfull = await stealArtifact(game);
                    break;
                case 3:
                    successfull = await timeJump(game);
                    break;
                case 4:
                    successfull = await timeReverse(game);
                    break;
            }
            //Verify if everything goes right with the card action
            if(successfull.result == false) {
                return{status:400, result: {msg: successfull.msg}}
            }
            //Delete card from database
            await pool.query("delete from user_game_card where ugc_id = ?", [body.selected_card]);
            //Return success
            return{status:200, result: {msg: "Card played succesfully"}}
        } catch(err) {
            console.log(err);
            return{status: 200, result:err}
        }
    }
}

async function claimArtifact(game){
    let successfull = false;
    let msg = "";
    //Get all artifacts of the game
    let [artifacts] = await pool.query("select * from game_artifact where ga_gm_id = ?", [game.id]);
    for(let artifact of artifacts){
        if(game.player.position == artifact.ga_current_position){
            await pool.query("update game_artifact set ga_current_owner = ? where ga_id = ?", [game.player.id, artifact.ga_id]);
            await pool.query("update game_artifact set ga_current_position = null where ga_id = ?", [artifact.ga_id]);
            successfull = true;
        }
    }
    if(successfull == false)
        msg = "There is no artifacts at this position!";
    return {result: successfull, msg: msg};
}

async function stealArtifact(game){
    //Get all opp's artifacts
    let [oppArtifacts] = await pool.query('select * from game_artifact where ga_current_owner = ?', [game.opponents[0].id]);
    //Verify if opp have some artifact
    if(!oppArtifacts.length){
        return{result: false, msg: "The Opponent has no artifacts"}
    }
    //Select a random Artifact from this list
    let randomArtifact = Utils.randomNumber(oppArtifacts.length);
    //Update the owner of the selected artifact
    await pool.query('update game_artifact set ga_current_owner = ? where ga_id = ?', [game.player.id, oppArtifacts[randomArtifact-1].ga_id]);
    return{result: true, msg: "Succesfully Played"}
}

async function timeJump(game){
    //Get the current era
    let current_era = Math.ceil(game.player.position / 5);
    let next_era;
    //Calculate the next era
    if(game.reversedBoard){
        next_era = current_era - 1;
        //If is lower than 1, then he goes to the last era
        if(next_era < 1){
            next_era = 7;
        }
    }else{
        next_era = current_era + 1;
        //If is higher than 7, then he goes to the first era
        if(next_era > 7){
            next_era = 1;
        }
    }
    //Take the era and put the player in the first position of the era ("- 4")
    let next_position = next_era * 5 - 4;
    console.log(next_era, next_position);
    //Update on database
    await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [next_position, game.player.id]);
    return{result: true, msg:""}
}

async function timeReverse(game){
    if(game.reversedBoard){
        await pool.query('update game set gm_reversed_board = ? where gm_id = ?', [false, game.id]);
    }else{
        await pool.query('update game set gm_reversed_board = ? where gm_id = ?', [true, game.id]);
    }
    return{result: true, msg: ""}
}

module.exports = Card;