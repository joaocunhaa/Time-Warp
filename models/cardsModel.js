const { selectFields } = require("express-validator/src/select-fields");
const pool = require("../config/database");
const Utils = require("../config/utils");
const Plays = require("./playsModel");

class Card {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static async getCards(game) {
        try {
            let result = {
                playerCards: [],
                oppCards: 0
            };

            //Get all the cards of the player
            let [cards] = await pool.query('select * from user_game_card, card where ugc_crd_id = crd_id and ugc_ug_id = ?', [game.player.id]);
            for (let card of cards) {
                result.playerCards.push(new Card(card.ugc_id, card.crd_name, card.crd_description));
            }

            //Get the amount of cards that the opponent has
            [cards] = await pool.query('select * from user_game_card, card where ugc_crd_id = crd_id and ugc_ug_id = ?', [game.opponents[0].id]);
            result.oppCards = cards.length;

            return { status: 200, result: result }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }

    static async drawCard(game, cheat, body) {
        try {
            //Verify if its player's turn
            if (game.player.state.name == "Waiting") {
                return { status: 400, result: { msg: "You can't draw since its not your turn!" } }
            }

            //Verify if player has more than 5 cards
            let [cards] = await pool.query('select * from user_game_card where ugc_ug_id = ?', [game.player.id]);
            if (cards.length >= 5) {
                return { status: 400, result: { msg: "You can't have more than 5 cards!" } }
            }

            let selectedCard;
            if (!cheat) {
                //Select a random Card
                [cards] = await pool.query('select * from card');
                selectedCard = Utils.randomNumber(100);
                if (selectedCard <= 20) {
                    selectedCard = 1;
                } else if (selectedCard <= 30) {
                    selectedCard = 2;
                } else if (selectedCard <= 44) {
                    selectedCard = 3;
                } else if (selectedCard <= 58) {
                    selectedCard = 4;
                } else if (selectedCard <= 72) {
                    selectedCard = 5;
                } else if (selectedCard <= 88) {
                    selectedCard = 6;
                } else if (selectedCard <= 100) {
                    selectedCard = 7;
                }
            } else { selectedCard = body.selected_card; }

            //Insert into database
            await pool.query('insert into user_game_card(ugc_ug_id, ugc_crd_id) values (?,?)', [game.player.id, selectedCard]);
            if (!cheat)
                await Plays.endTurn(game);
            return { status: 200, result: { msg: "Card Successfully Drawn!" } }
        } catch (err) {
            console.log(err)
            return { status: 500, result: err }
        }
    }

    static async playCard(game, body) {
        try {
            let successfull = { result: false, msg: null };

            //Verify if its player's turn
            if (game.player.state.name == "Waiting")
                return { status: 400, result: { msg: "You can't play since its not your turn!" } }

            let [cards] = await pool.query('select * from user_game_card where ugc_id = ?', [body.selected_card]);

            //Verify if the card exists
            if (!cards.length)
                return { status: 400, result: { msg: "Select a valid card!" } }


            //Get the type of card and do the respective action
            switch (cards[0].ugc_crd_id) {
                case 1:
                    successfull = await claimArtifact(game);
                    break;
                case 2:
                    successfull = await dropArtifact(game);
                    break;
                case 3:
                    successfull = await timeJump(game);
                    break;
                case 4:
                    successfull = await timeReverse(game);
                    break;
                case 5:
                    successfull = await paradox(game);
                    break;
                case 6:
                    successfull = await switchPlayers(game);
                    break;
                case 7:
                    successfull = await cancelAction(game);
                    break;
            }

            //Verify if everything goes right with the card action
            if (successfull.result == false) {
                return { status: 400, result: { msg: successfull.msg } }
            }

            //Delete card from database
            await pool.query("delete from user_game_card where ugc_id = ?", [body.selected_card]);
            //Return success
            await Plays.endTurn(game);
            return { status: 200, result: { msg: successfull.msg } }
        } catch (err) {
            console.log(err);
            return { status: 200, result: err }
        }
    }

    static async dropCard(game, cheat, body) {
        try {
            //Verify if its player's turn
            if (game.player.state.name == "Waiting")
                return { status: 400, result: { msg: "You can't drop since its not your turn!" } }


            if (!cheat) {
                let [card] = await pool.query('select * from user_game_card where ugc_id = ?', [body.selected_card]);
                if (!card.length)
                    return { status: 400, result: { msg: "Select a valid card." } }

                await pool.query('delete from user_game_card where ugc_id = ?', [body.selected_card]);
            } else { await pool.query('delete from user_game_card where ugc_ug_id = ?', [game.player.id]); }

            //Return success
            if (!cheat)
                await Plays.endTurn(game);
            return { status: 200, result: { msg: "Card descarted succesfully!" } }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }
}

async function claimArtifact(game) {
    let successfull = false;
    let msg = "Succesfully Played";

    //Get all artifacts of the game
    let [artifacts] = await pool.query("select * from game_artifact where ga_gm_id = ?", [game.id]);
    for (let artifact of artifacts) {
        if (game.player.position == artifact.ga_current_position) {
            await pool.query("update game_artifact set ga_current_owner = ? where ga_id = ?", [game.player.id, artifact.ga_id]);
            await pool.query("update game_artifact set ga_current_position = null where ga_id = ?", [artifact.ga_id]);
            successfull = true;
            msg = "Succesfully Played"
        }
    }
    if (!successfull) msg = "There are no artifacts at this position!";
    return { result: successfull, msg: msg };
}

async function dropArtifact(game) {
    let current_era = Math.ceil(game.player.position / 5);
    let opp_era = Math.ceil(game.opponents[0].position / 5);
    if (current_era != opp_era)
        return { result: false, msg: "You need to be in the same era as the opponent." }

    if (game.opponents[0].protected == true) {
        await pool.query("update user_game set ug_protected = false where ug_id = ?", [game.opponents[0].id]);
        return { result: true, msg: "No action, opponent played a shield card." }
    }
    //Get all opp's artifacts
    let [oppArtifacts] = await pool.query('select * from game_artifact where ga_current_owner = ?', [game.opponents[0].id]);

    //Verify if opp have some artifact
    if (!oppArtifacts.length)
        return { result: false, msg: "The Opponent has no artifacts." }

    //Select a random Artifact from this list
    let randomArtifact = Utils.randomNumber(oppArtifacts.length);
    let randomPosition = 0;
    let [artifacts] = [];
    do {
        let [artifactInfo] = await pool.query("select * from game_artifact inner join artifact on ga_art_id = art_id where ga_id = ?", [oppArtifacts[randomArtifact - 1].ga_id]);
        randomPosition = Utils.randomNumber(5) + (5 * artifactInfo[0].art_era_id) - 5;
        console.log(artifactInfo[0].art_era_id);
        console.log(randomPosition);
        [artifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_position = ?', [game.id, randomPosition]);
    } while (artifacts.length > 0)

    await pool.query('update game_artifact set ga_current_owner = null, ga_current_position = ? where ga_id = ?', [randomPosition, oppArtifacts[randomArtifact - 1].ga_id]);
    return { result: true, msg: "Succesfully Played" }
}

async function timeJump(game) {
    //Get the current era
    let current_era = Math.ceil(game.player.position / 5);
    let next_era;

    //Calculate the next era
    if (game.player.reversed_direction) {
        next_era = current_era - 1;

        //If is lower than 1, then the player goes to the last era
        if (next_era < 1) {
            next_era = 7;
            await pool.query('update user_game set ug_reversed_direction = false where ug_id =?', [game.player.id]);
        }
    } else {
        next_era = current_era + 1;

        //If it is higher than 7, then the player goes to the first era
        if (next_era > 7) {
            next_era = 1;
            await pool.query('update user_game set ug_reversed_direction = true where ug_id =?', [game.player.id]);
        }
    }

    //Take the era and put the player in the first position of the era ("- 4")
    let next_position;
    if (game.player.reversed_direction)
        next_position = next_era * 5;
    else next_position = next_era * 5 - 4;

    //Update on database
    await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [next_position, game.player.id]);

    return { result: true, msg: "Succesfully Played" }
}

async function timeReverse(game) {
    if (game.opponents[0].protected == true) {
        await pool.query("update user_game set ug_protected = false where ug_id = ?", [game.opponents[0].id]);
        return { result: true, msg: "No action, opponent played a shield card." }
    }
    //Player Reverse
    if (game.player.reversed_direction)
        await pool.query('update user_game set ug_reversed_direction = false where ug_id = ?', [game.player.id]);
    else await pool.query('update user_game set ug_reversed_direction = true where ug_id = ?', [game.player.id]);
    //Opp Reverse
    if (game.opponents[0].reversed_direction)
        await pool.query('update user_game set ug_reversed_direction = false where ug_id = ?', [game.opponents[0].id]);
    else await pool.query('update user_game set ug_reversed_direction = true where ug_id = ?', [game.opponents[0].id]);

    return { result: true, msg: "Succesfully Played" }
}

async function paradox(game) {
    if (game.opponents[0].protected == true) {
        await pool.query("update user_game set ug_protected = false where ug_id = ?", [game.opponents[0].id]);
        return { result: true, msg: "No action, opponent played a shield card." }
    }
    let [artifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner is null', [game.id]);
    let [eras] = await pool.query('select * from era');
    for (let artifact of artifacts) {
        let randomEra = Utils.randomNumber(eras.length);
        let position = Utils.randomPosition(randomEra);
        await pool.query(`update game_artifact set ga_current_position = ? where ga_id = ?`, [position, artifact.ga_id]);
    }

    return { result: true, msg: "Succesfully Played" }
}

async function switchPlayers(game) {
    if (game.opponents[0].protected == true) {
        await pool.query("update user_game set ug_protected = false where ug_id = ?", [game.opponents[0].id]);
        return { result: true, msg: "No action, opponent played a shield card." }
    }
    let oppPosition = game.opponents[0].position;
    let playerPosition = game.player.position;
    await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [oppPosition, game.player.id]);
    await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [playerPosition, game.opponents[0].id]);
    return { result: true, msg: "Succesfully Played" }
}

async function cancelAction(game) {
    if (game.player.protected == true)
        return { result: false, msg: "The player is already protected." }

    await pool.query('update user_game set ug_protected = true where ug_id = ?', [game.player.id]);
    return { result: true, msg: "Succesfully Played" }
}
module.exports = Card;