const pool = require("../config/database");
const Games = require("./gamesModel");

class Pawn {
    constructor(id, position) {
        this.id = id;
        this.position = position;
    }

    static async getPawnsPositions(game) {
        try {
            let result = {};
            result.playerPawn = new Pawn(game.player.id, game.player.position);
            result.oppPawn = new Pawn(game.opponents[0].id, game.opponents[0].position);

            return { status: 200, result: result }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }

    static async movePawn(game) {
        try {
            let nextPosition = 0;
            //Check if its player's turn
            if (game.player.state.name == "Waiting") 
                return { status: 400, result: { msg: "You cant play, since is not your turn" } }
            
            //Reversing Board
            if (game.player.reversed_direction) {
                if (game.player.position == 1) {
                    await pool.query('update user_game set ug_reversed_direction = false, ug_touched_final = true where ug_id = ?', [game.player.id]);
                    await pool.query('update game_artifact set ga_drop_user = null where ga_drop_user = ?', [game.player.id]);
                    nextPosition = game.player.position + 1;
                } else { nextPosition = game.player.position - 1; }
            } else {
                if (game.player.position == 35) {
                    await pool.query('update user_game set ug_reversed_direction = true, ug_touched_final = true where ug_id = ?', [game.player.id]);
                    await pool.query('update game_artifact set ga_drop_user = null where ga_drop_user = ?', [game.player.id]);
                    nextPosition = game.player.position - 1;
                } else { nextPosition = game.player.position + 1; }
            }

            await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [nextPosition, game.player.id]);

            return { status: 200, result: { msg: "Succesfully moved" } }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }

    static async surrender(game) {
        try {
            //Pass all the artifacts for the opponent
            await pool.query('update game_artifact set ga_current_owner = ? where ga_gm_id = ?', [game.opponents[0].id, game.id]);
            await Games.endGame(game);
            return { status: 200, result: "Surrendered successfully!" }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = Pawn;