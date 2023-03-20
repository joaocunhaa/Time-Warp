const pool = require("../config/database");

class Artifact{
    constructor(id, name, current_owner, current_position){
        this.id = id;
        this.name = name;
        this.current_owner = current_owner;
        this.current_position = current_position;
    }

    static async getArtifactsInBoard(game){
        try{
            let result = [];
            let [artifacts] = await pool.query('select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner is null and ga_gm_id = ?', [game.id]);
            for(let art of artifacts){
                result.push(new Artifact(art.ga_id, art.art_name, art.ga_current_owner, art.ga_current_position));
            }

            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }

    static async getPlayerArtifacts(game, player_id){
        try{
            let result = [];
            let [artifacts] = await pool.query('select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner = ? and ga_gm_id = ?', [player_id, game.id]);
            for(let art of artifacts){
                result.push(new Artifact(art.ga_id, art.art_name, art.ga_current_owner, art.ga_current_position));
            }
            return{status: 200, result: result}
        } catch(err) {
            console.log(err);
            return{status: 500, result: err}
        }
    }
}

module.exports = Artifact