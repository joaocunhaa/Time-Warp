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

    // static async movePawn(game){
    //     try{

    //     } catch(err) {
    //         console.log(err);
    //         return{status: 500, result: err}
    //     }
    // }
}


module.exports = Pawn;