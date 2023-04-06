const pool = require("../config/database");

class Artifact {
    constructor(id, name, current_owner, current_position, dropped, drop_user) {
        this.id = id;
        this.name = name;
        this.current_owner = current_owner;
        this.current_position = current_position;
        this.dropped = dropped;
        this.drop_user = drop_user;
    }

    static async getArtifactsInBoard(game) {
        try {
            let result = [];

            //Get All the artifacts without an owner in the game
            let [artifacts] = await pool.query('select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner is null and ga_gm_id = ?', [game.id]);
            for (let art of artifacts) {
                result.push(new Artifact(art.ga_id, art.art_name, art.ga_current_owner, art.ga_current_position, art.ga_dropped, art.ga_drop_user));
            }
            return { status: 200, result: result }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }

    static async getCollectedArtifacts(game) {
        try {
            let result = {
                playerArtifacts: [],
                oppArtifacts: []
            };

            //Select all the artifacts of the player
            let [artifacts] = await pool.query('select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner = ? and ga_gm_id = ?', [game.player.id, game.id]);

            //Add it on playerArtifacts
            for (let art of artifacts) {
                result.playerArtifacts.push(new Artifact(art.ga_id, art.art_name, art.ga_current_owner, art.ga_current_position, art.ga_dropped, art.ga_drop_user));
            }

            //Select all opponent's artifacts
            [artifacts] = await pool.query('select * from game_artifact, artifact where ga_art_id = art_id and ga_current_owner = ? and ga_gm_id = ?', [game.opponents[0].id, game.id]);

            //Add it on oppArtifacts
            for (let art of artifacts) {
                result.oppArtifacts.push(new Artifact(art.ga_id, art.art_name, art.ga_current_owner, art.ga_current_position, art.ga_dropped, art.ga_drop_user));
            }
            return { status: 200, result: result }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }

    static async collectAllArtifacts(game) {
        try {
            //Verify if its player's turn
            if (game.player.state.name == "Waiting")
                return { status: 400, result: { msg: "You can't collect since its not your turn!" } }

            //Collect all
            await pool.query('update game_artifact set ga_current_owner = ? where ga_gm_id = ?', [game.player.id, game.id]);

            //Return success
            return { status: 200, result: { msg: "Collected Succesfully" } }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err }
        }
    }
}

module.exports = Artifact