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
        if (this.opened) {
            if (this.player.state == "Won") {
                fill(100, 200, 100);
                stroke(0, 0, 0);
            }
            else {
                fill(255, 0, 0)
                stroke(0, 0, 0);
            }

            rect(this.x, this.y, this.width, this.height, 5, 5, 5, 5);

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