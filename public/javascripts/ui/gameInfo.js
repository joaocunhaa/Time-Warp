//All the variables for the game UI
//we only have one game info so everything is static
class GameInfo {
    //Settings variables
    static width = 1366;
    static height = 800;

    static loading = true;
    static clicked = false;

    //Data
    static game;
    static currentTrack;

    static playerPosition;
    static playerLastPosition;
    static oppPosition;

    static playerEra;

    static artifactsOnBoard;

    static playerListArtifacts;
    static oppListArtifacts;

    static playerDeck;
    static oppDeck;

    static images = {};
    static sounds = {};

    //Pop-ups
    static warning;
    static popUp;

    //Animations
    static currentCardAnimation;
    static tintAnimation = 0;
    static animationTintMax = 255;
    static reversingAnimation = false;

    //Drop Card
    static dropping = false;

    //Renderers
    static scoreBoard;
    static scoreWindow;
    static board;

    //Buttons
    static movePawn;
    static drawCard;
    static surrend;

    //Windows
    static scoreWindow;

    //Write your UI settings for each game state here
    //Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Playing") {
            GameInfo.clicked = false;
            GameInfo.movePawn.show();
            GameInfo.drawCard.show();
            GameInfo.dropCard.show();
            GameInfo.surrend.show();
        } else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.movePawn.hide();
            GameInfo.drawCard.hide();
            GameInfo.dropCard.hide();
            GameInfo.surrend.show();
        }else if (GameInfo.game.player.state == "Score") {
            GameInfo.clicked = false;
            GameInfo.movePawn.hide();
            GameInfo.drawCard.hide();
            GameInfo.dropCard.hide();
            GameInfo.surrend.hide();
            GameInfo.scoreWindow.open();
        }
    }
}