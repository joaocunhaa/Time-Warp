// Artifacts Box
class Artifact {
    constructor(name, desc, x, y, width, height) {
        this.name = name;
        this.desc = desc;
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

    hover(){
        return mouseX > this.x && mouseX < this.x + this.width &&
            mouseY > this.y && mouseY < this.y + this.height;
        
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
                arts.push(new Artifact(artifact.name, artifact.desc, 140 - 105, 200 + 60 * y, 210, 50));
                y++;
            }
        } else if (this.entity == "Opponent") {
            for (let artifact of artifacts) {
                arts.push(new Artifact(artifact.name, artifact.desc, 1222 - 105, 200 + 60 * y, 210, 50));
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
            rect(20, 110, 245, 515, 5, 5, 5, 5)
            if (GameInfo.game.player.state == "Playing") {
                fill(255)
            }
            else {
                fill(0)
            }
            text(GameInfo.game.player.name, 140, 135);
            // text(`(${GameInfo.game.player.state})`, 140, 170);
            text("Your Artifacts", 140, 170);
        } else if (this.entity == "Opponent") {
            fill(143, 121, 101, 125);
            rect(1100, 110, 245, 515, 5, 5, 5, 5)
            if (GameInfo.game.opponents[0].state == "Playing") {
                fill(255)
            }
            else {
                fill(0)
            }
            text(GameInfo.game.opponents[0].name, 1222, 135);
            // text(`(${GameInfo.game.opponents[0].state})`, 1222, 170);
            text("Opponent's Artifacts", 1222, 170);
        }

        for (let artifact of this.artifacts) {
            artifact.draw();
        }
    }

    hover(){
        if(this.entity == "Player"){
            for (let artifact of this.artifacts) {
                if (artifact.hover()) {
                    fill(255, 255, 255, 70)
                    rect(artifact.x, artifact.y, artifact.width, artifact.height);
                    fill(143, 121, 101, 250)
                    strokeWeight(2);
                    rect(artifact.x + artifact.width + 5, artifact.y - artifact.height, 300, 150);
                    strokeWeight(0);
                    fill(0)
                    textStyle(BOLD);
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    stroke(0);
                    textSize(20)
                    text(artifact.name, artifact.x + artifact.width + 155, artifact.y + artifact.height / 2 - artifact.height);
                    textSize(14)
                    text(artifact.desc, artifact.x + artifact.width + 155, artifact.y + 75 - artifact.height);
                }
            }
        }else if(this.entity == "Opponent"){
            for (let artifact of this.artifacts) {
                if (artifact.hover()) {
                    fill(255, 255, 255, 70)
                    rect(artifact.x, artifact.y, artifact.width, artifact.height);
                    fill(143, 121, 101, 250)
                    strokeWeight(2);
                    rect(artifact.x - 305, artifact.y - artifact.height, 300, 150);
                    strokeWeight(0);
                    fill(0)
                    textStyle(BOLD);
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    stroke(0);
                    textSize(20)
                    text(artifact.name, artifact.x - 305 + 155, artifact.y + artifact.height / 2 - artifact.height);
                    textSize(14)
                    text(artifact.desc, artifact.x - 305 + 155, artifact.y + 75 - artifact.height);
                }
            }
        }
    }
}