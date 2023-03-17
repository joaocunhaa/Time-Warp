const pool = require("../config/database");

class Pawn{
    constructor(id, position){
        this.id = id;
        this.position = position;
    }

    static async getPawnsPositions(game){
        try{
            let result = {};
            let [pawn] = await pool.query('select * from user_game where ug_id = ?', [game.player.id]);
            result.playerPawn = new Pawn(game.player.id, pawn[0].ug_current_position);
            [pawn] = await pool.query('select * from user_game where ug_id = ?', [game.opponents[0].id]);
            result.oppPawn = new Pawn(game.opponents[0].id, pawn[0].ug_current_position);

            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }

    static async movePawn(game){
        try{
            if(game.player.state.name != "Playing"){
                return{status: 400, result: {msg: "You cant play, since is not your turn"}}
            }
            let [gameInfo] = await pool.query('select * from game where gm_id = ?', [game.id]);
            let [playerInfo] = await pool.query('select * from user_game where ug_id = ?', [game.player.id]);
            let nextPosition = 0;
            console.log(playerInfo);
            if (gameInfo.gm_reversed_board == true){
                nextPosition = playerInfo[0].ug_current_position - 1;
            }else{
                nextPosition = playerInfo[0].ug_current_position + 1;
            }
            await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [nextPosition, game.player.id]);
            return{status:200, result: {msg: "Succesfully moved"}}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }
}


module.exports = Pawn;