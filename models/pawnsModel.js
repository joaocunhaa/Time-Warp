const pool = require("../config/database");

class Pawn{
    constructor(id, position){
        this.id = id;
        this.position = position;
    }

    static async getPawnsPositions(game){
        try{
            let result = {};
            result.playerPawn = new Pawn(game.player.id, game.player.position);
            result.oppPawn = new Pawn(game.opponents[0].id, game.opponents[0].position);

            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }

    static async movePawn(game){
        try{            
            let nextPosition = 0
            //Check if it's  player's turn
            if(game.player.state.name != "Playing"){
                return{status: 400, result: {msg: "You cant play, since is not your turn"}}
            }
            //Check if the board is reversed
            if (game.reversed_board == true){
                if(game.player.position == 1){
                    //Goes back to position 35
                    nextPosition = 35;
                }else{
                    //Decrease the pawn position by 1
                    nextPosition = game.player.position - 1;
                }
            }else if(game.player.position == 35){
                //Get the artifacts currently active in the game
                let [artifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner is null', [game.id]);
                if(!artifacts.length){
                    //Finishes the game
                    await pool.query('update game set gm_state_id = 3 where gm_id = ?', [game.id])
                }
                //Goes back to position 1
                nextPosition = 1;
            }else{
                //Increase the position by 1
                nextPosition = game.player.position + 1;
            }
            //Update on database
            await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [nextPosition, game.player.id]);
            
            return{status:200, result: {msg: "Succesfully moved"}}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }
}


module.exports = Pawn;