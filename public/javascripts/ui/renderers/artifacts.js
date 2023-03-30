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
        fill(255)
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height);
        strokeWeight(0);
        fill(0)
        textStyle(BOLD);
        textSize(14);
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
        let x = 0;
        let y = 0;
        if (this.entity == "Player") {
            for (let artifact of artifacts) {
                if (y < 6 && y >= 4) {
                    y = 0;
                    x++;
                }
                arts.push(new Artifact(artifact.name, 20 + 140 * x, 230 + 60 * y, 130, 50));
                y++;
            }
        } else if (this.entity == "Opponent") {
            for (let artifact of artifacts) {
                if (y < 6 && y >= 4) {
                    y = 0;
                    x++;
                }
                arts.push(new Artifact(artifact.name, 1230 - 140 * x, 230 + 60 * y, 130, 50));
                y++;
            }
        }
        return arts;
    }

    draw() {
        fill(0)
        textStyle(BOLD);
        textSize(24);
        textAlign(LEFT, CENTER);
        stroke(0);

        if (this.entity == "Player") {
            text("Your Artifacts", 50, 205);
            text(GameInfo.game.player.name, 10, 170);
            text(`(${GameInfo.game.player.state})`, 10 + 140, 170);
        } else if (this.entity == "Opponent") {
            text("Opponents Artifacts", 1100, 205);
            text(GameInfo.game.opponents[0].name, 1100, 170);
            text(`(${GameInfo.game.opponents[0].state})`, 1100 + 140, 170);
        }

        for (let artifact of this.artifacts) {
            artifact.draw();
        }
    }
}