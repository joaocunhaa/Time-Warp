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
            await checkEndGame(game);

            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }

    static async movePawn(game){
        try{            
            let nextPosition = 0;            
            //Check if it's  player's turn
            if(game.player.state.name != "Playing"){
                return{status: 400, result: {msg: "You cant play, since is not your turn"}}
            }            
            //Reversing Board
            if(game.player.reversed_direction){
                if(game.player.position == 1){
                    let hasEnded = await checkEndGame(game);
                    if(!hasEnded){
                        await pool.query('update user_game set ug_reversed_direction = false where ug_id = ?', [game.player.id]);
                        nextPosition = game.player.position + 1;
                    }else{
                        await endGame(game);
                    }
                }else{
                    nextPosition = game.player.position - 1;
                }
            }else{
                if(game.player.position == 35){
                    let hasEnded = await checkEndGame(game);
                    if(!hasEnded){
                        await pool.query('update user_game set ug_reversed_direction = true where ug_id = ?', [game.player.id]);
                        nextPosition = game.player.position - 1;
                    }else{
                        await endGame(game);
                    }
                }else{
                    nextPosition = game.player.position + 1;
                }
            }
            await pool.query('update user_game set ug_current_position = ? where ug_id = ?', [nextPosition, game.player.id]);

            return{status:200, result: {msg: "Succesfully moved"}}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }

    static async surrender(game){
        try{
            //Pass all the artifacts for the opponent
            await pool.query('update game_artifact set ga_current_owner = ? where ga_gm_id = ?', [game.opponents[0].id, game.id]);
            await endGame(game);
            // await pool.query('update game set gm_state_id = 5 where gm_id = ?', [game.id]);
            return{status: 200, result: "Surrendered successfully!"}
        } catch(err) {
            console.log(err);
            return{status:500, result: err};
        }
    }
}

async function checkEndGame(game){
    let hasEnded = false;
    let [artifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner is null', [game.id]);
    if(!artifacts.length){
        hasEnded = true;
    }
    return hasEnded;
}

async function endGame(game){
    // Both players go to score phase (id = 3)
    let sqlPlayer = `Update user_game set ug_state_id = ? where ug_id = ?`;
    await pool.query(sqlPlayer, [3, game.player.id]);
    await pool.query(sqlPlayer, [3, game.opponents[0].id]);
    // Set game to finished (id = 3)
    await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [3, game.id]);

    let [playerArtifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner = ?', [game.id, game.player.id]);
    let [oppArtifacts] = await pool.query('select * from game_artifact where ga_gm_id = ? and ga_current_owner = ?', [game.id, game.opponents[0].id]);
    
    let sqlScore = `Insert into scoreboard (sb_ug_id,sb_state_id) values (?,?)`;
    if(playerArtifacts.length > oppArtifacts.length){
        await pool.query(sqlScore, [game.player.id, 3]);
        await pool.query(sqlScore, [game.opponents[0].id, 2]);
    }else{
        await pool.query(sqlScore, [game.player.id, 2]);
        await pool.query(sqlScore, [game.opponents[0].id, 3]);
    }
}


module.exports = Pawn;