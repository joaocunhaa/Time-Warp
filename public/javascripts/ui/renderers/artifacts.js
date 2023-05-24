// Artifacts Box
class Artifact {
    constructor(name, x, y, width, height) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        fill(200)
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height);
        strokeWeight(0);
        fill(0)
        textStyle(BOLD);
        textSize(16);
        textAlign(CENTER, CENTER);
        stroke(0);
        text(this.name, this.x + this.width / 2, this.y + this.height / 2);
    }
}

// Artifacts List
class ListArtifacts {
    constructor(entity, artifacts) {
        this.entity = entity;
        this.artifacts = this.createArtifacts(artifacts);
    }

    createArtifacts(artifacts) {
        let arts = [];
        let y = 0;
        if (this.entity == "Player") {
            for (let artifact of artifacts) {
                arts.push(new Artifact(artifact.name, 140 - 105, 230 + 60 * y, 210, 50));
                y++;
            }
        } else if (this.entity == "Opponent") {
            for (let artifact of artifacts) {
                arts.push(new Artifact(artifact.name, 1222 - 105, 230 + 60 * y, 210, 50));
                y++;
            }
        }
        return arts;
    }

    draw() {
        fill(0)
        textStyle(BOLD);
        textSize(24);
        textAlign(CENTER, CENTER);
        stroke(0);

        if (this.entity == "Player") {
            fill(143, 121, 101, 125);
            rect(20, 110, 245, 545, 5, 5, 5, 5)
            fill(0)
            text(GameInfo.game.player.name, 140, 135);
            text(`(${GameInfo.game.player.state})`, 140, 170);
            text("Your Artifacts", 140, 205);
        } else if (this.entity == "Opponent") {
            fill(143, 121, 101, 125);
            rect(1100, 110, 245, 545, 5, 5, 5, 5)
            fill(0)
            text(GameInfo.game.opponents[0].name, 1222, 135);
            text(`(${GameInfo.game.opponents[0].state})`, 1222, 170);
            text("Opponent's Artifacts", 1222, 205);
        }

        for (let artifact of this.artifacts) {
            artifact.draw();
        }
    }
}