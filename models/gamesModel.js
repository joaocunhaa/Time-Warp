const pool = require("../config/database");
const Utils = require("../config/utils");
const State = require("./statesModel");

// For now it is only an auxiliary class to hold data in here 
// so no need to create a model file for it
class Player {
    constructor(id, name, state, position, reversed_direction, touched_final) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.position = position;
        this.reversed_direction = reversed_direction;
        this.touched_final = touched_final;
    }
    export() {
        let player = new Player();
        player.id = this.id;
        player.name = this.name;
        player.state = this.state.export();
        player.position = this.position;
        player.reversed_direction = this.reversed_direction;
        player.touched_final = this.touched_final;
        return player;
    }
}

class Game {
    constructor(id, turn, state, player, opponents) {
        this.id = id;
        this.turn = turn;
        this.state = state;
        this.player = player;
        this.opponents = opponents || [];
    }
    export() {
        let game = new Game();
        game.id = this.id;
        game.turn = this.turn;
        game.state = this.state.export();
        if (this.player)
            game.player = this.player.export();
        game.opponents = this.opponents.map(o => o.export());
        return game;
    }

    // No verifications, we assume they were already made
    // This is mostly an auxiliary method
    static async fillPlayersOfGame(userId, game) {
        try {
            let [dbPlayers] = await pool.query(`Select * from user 
            inner join user_game on ug_user_id = usr_id
             inner join user_game_state on ugst_id = ug_state_id
            where ug_game_id=?`, [game.id]);
            for (let dbPlayer of dbPlayers) {
                let player = new Player(dbPlayer.ug_id, dbPlayer.usr_name,
                    new State(dbPlayer.ugst_id, dbPlayer.ugst_state), dbPlayer.ug_current_position, dbPlayer.ug_reversed_direction, dbPlayer.ug_touched_final);
                if (dbPlayer.usr_id == userId) game.player = player;
                else game.opponents.push(player);
            }
            return { status: 200, result: game };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getPlayerActiveGame(id) {
        try {
            let [dbGames] =
                await pool.query(`Select * from game 
                    inner join user_game on gm_id = ug_game_id 
                    inner join user_game_state on ug_state_id = ugst_id
                    inner join game_state on gm_state_id = gst_id
                    where ug_user_id=? and (gst_state IN ('Waiting','Started')
                    or (gst_state = 'Finished' and ugst_state = 'Score'))`, [id]);
            if (dbGames.length == 0)
                return { status: 200, result: false };
            let dbGame = dbGames[0];
            let game = new Game(dbGame.gm_id, dbGame.gm_turn, new State(dbGame.gst_id, dbGame.gst_state));
            let result = await this.fillPlayersOfGame(id, game);
            if (result.status != 200)
                return result;
            
            game = result.result;
            if(game.state.name == "Started"){
                if(game.player.position == 1 || game.player.position == 35 || game.opponents[0].position == 1 || game.opponents[0].position == 35){
                    let hasEnded = await this.checkEndGame(game);
                    if(hasEnded){
                        await this.endGame(game);
                    }
                }
            }
            return { status: 200, result: game };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getGamesWaitingForPlayers(userId) {
        try {
            let [dbGames] =
                await pool.query(`Select * from game 
                    inner join game_state on gm_state_id = gst_id
                    where gst_state = 'Waiting'`);
            let games = [];
            for (let dbGame of dbGames) {
                let game = new Game(dbGame.gm_id, dbGame.gm_turn, new State(dbGame.gst_id, dbGame.gst_state));
                let result = await this.fillPlayersOfGame(userId, game);
                if (result.status != 200) {
                    return result;
                }
                game = result.result;
                games.push(game);
            }
            return { status: 200, result: games };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


    // A game is always created with one user
    // No verifications. We assume the following were already made (because of authentication):
    //  - Id exists and user exists
    //  - User does not have an active game
    static async create(userId) {
        try {
            // create the game
            let [result] = await pool.query(`Insert into game (gm_state_id) values (?)`, [1]);
            let gameId = result.insertId;
            let position = await setRandomPosition()
            // add the user to the game
            await pool.query(`Insert into user_game (ug_user_id,ug_game_id,ug_state_id,ug_current_position) values (?,?,?,?)`,
                [userId, gameId, 1, position]);
            return { status: 200, result: { msg: "You created a new game." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


    // No verification needed since we considered that it was already made 
    // This should have a verification from every player
    // - If only one player it would cancel
    // - Else, each player would only change his state to cancel
    // - When the last player run the cancel the game would cancel
    // (no need to be this complex since we will only use this to invalidate games)
    static async cancel(gameId) {
        try {
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`,
                [4, gameId]);
            return { status: 200, result: { msg: "Game canceled." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }



    // ---- These methods assume a two players game (we need it at this point) --------


    // We consider the following verifications were already made (because of authentication):
    //  - Id exists and user exists
    //  - User does not have an active game
    // We still need to check if the game exist and if it is waiting for players
    static async join(userId, gameId) {
        try {
            let [dbGames] = await pool.query(`Select * from game where gm_id=?`, [gameId]);
            if (dbGames.length == 0)
                return { status: 404, result: { msg: "Game not found" } };
            let dbGame = dbGames[0];
            if (dbGame.gm_state_id != 1)
                return { status: 400, result: { msg: "Game not waiting for other players" } };

            // Randomly determine who starts    
            let myTurn = (Math.random() < 0.5);

            await setGameArtifacts(gameId);
            let position = await setRandomPosition();
            
            //Define start direction
            let [opp] = await pool.query("select * from user_game where ug_user_id != ? and ug_game_id = ?", [userId, gameId]);

            if(opp[0].ug_current_position > position){
                await pool.query(`Insert into user_game (ug_user_id,ug_game_id,ug_state_id, ug_current_position, ug_reversed_direction) values (?,?,?,?, true)`, [userId, gameId, 1, position]);
            }else if (opp[0].ug_current_position < position){
                await pool.query(`Insert into user_game (ug_user_id,ug_game_id,ug_state_id, ug_current_position, ug_reversed_direction) values (?,?,?,?, false)`, [userId, gameId, 1, position]);
                //update opponnent's direction
                await pool.query(`update user_game set ug_reversed_direction = true where ug_id = ?`, [opp[0].ug_id]);
            }else{
                await pool.query(`Insert into user_game (ug_user_id,ug_game_id,ug_state_id, ug_current_position, ug_reversed_direction) values (?,?,?,?, false)`, [userId, gameId, 1, position]);
            }
            

            return { status: 200, result: { msg: "You joined the game." } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
    
    static async checkEndGame(game) {
        let hasEnded = false;
        let [artifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner is null', [game.id]);
        if (!artifacts.length) {
            hasEnded = true;
        }
        return hasEnded;
    }

    static async endGame(game) {
        // Both players go to score phase (id = 3)
        let sqlPlayer = `Update user_game set ug_state_id = ? where ug_id = ?`;
        await pool.query(sqlPlayer, [3, game.player.id]);
        await pool.query(sqlPlayer, [3, game.opponents[0].id]);
        // Set game to finished (id = 3)
        await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [3, game.id]);

        let [playerArtifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner = ?', [game.id, game.player.id]);
        let [oppArtifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner = ?', [game.id, game.opponents[0].id]);

        let sqlScore = `Insert into scoreboard (sb_ug_id,sb_state_id) values (?,?)`;
        if (playerArtifacts.length > oppArtifacts.length) {
            await pool.query(sqlScore, [game.player.id, 3]);
            await pool.query(sqlScore, [game.opponents[0].id, 2]);
        } else {
            await pool.query(sqlScore, [game.player.id, 2]);
            await pool.query(sqlScore, [game.opponents[0].id, 3]);
        }
    }

}

async function setGameArtifacts(game) {
    let [artifacts] = await pool.query(`select * from artifact`);
    for (let artifact of artifacts) {
        let position = Utils.randomPosition(artifact.art_era_id);
        await pool.query(`insert into game_artifact(ga_gm_id, ga_art_id, ga_current_position) values(?,?,?)`, [game, artifact.art_id, position]);
    }
}

async function setRandomPosition(){
    let randomPosition = 0;
    do{
        randomPosition = Utils.randomNumber(35);
    }while(randomPosition <= 5 || randomPosition >= 31);
    return randomPosition;
}

module.exports = Game;