const SB_WIDTH = 300;
const SB_HEIGHT = 100;
const SB_POSX = 10;
const SB_POSY = 10;

class ScoreBoard {
    constructor(game) {
        this.game = game;
    }
    draw() {
        fill(143, 121, 101, 125);
        stroke(0, 0, 0);
        rect(25, 25, 135, 30, 5, 5, 5, 5);
        fill(0, 0, 0);
        textAlign(LEFT, CENTER);
        textSize(24);
        textStyle(BOLD);
        text("TURN: " + this.game.turn, 25 + 8, 25 + 65 / 4)
    }

    update(game) {
        this.game = game;
    }
}