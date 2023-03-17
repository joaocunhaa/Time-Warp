// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width = 1200;
    static height = 600;

    static loading = true;

    // data
    static game;
    static playerPosition;
    static oppPosition;
    static images = {};
    static sounds = {};

    // renderers
    static scoreBoard;
    static board;

    // buttons
    static movePawn;

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Playing") { 
            GameInfo.movePawn.show();
        } else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.movePawn.hide();
        } 
    }
}