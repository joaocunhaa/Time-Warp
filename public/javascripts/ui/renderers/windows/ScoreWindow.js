class ScoreWindow extends Window {
    constructor(x, y, width, height, score, action) {
        super(x, y, width, height);
        this.score = score;
        this.player = this.score.playerScores[0];
        this.opp = this.score.playerScores[1];
        this.createButton("Return to Menu", x + width / 2, y + height - 45, action, 210, 33);
    }

    close() {
    }

    draw() {
        super.draw();
        if (this.opened) {
            fill(255);
            stroke(255);
            textAlign(CENTER, CENTER);
            textStyle(NORMAL);
            strokeWeight(1);
            textSize(30);
            text("Final Score", this.x, this.y + 5, this.width, this.height / 5);

            textSize(60);
            text("You " + this.player.state +"!",
            this.x, this.y, this.width, this.height - 40);

            textSize(35);
            text(this.opp.name + " " + this.opp.state,
            this.x, this.y, this.width, this.height + 70);
        }
    }
}