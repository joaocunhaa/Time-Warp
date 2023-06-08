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
        textStyle(BOLD);
        textSize(16);
        textAlign(CENTER, CENTER);
        switch (this.name) {
            case "Egyptian Scarab":
                fill(100, 200, 100);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.egyptian, this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                break;
            case "Greece Armor":
                fill(200, 100, 100);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.greek, this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                break;
            case "Roman Armor":
                fill(100, 100, 200);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.roman, this.x + 15, this.y);
                break;
            case "Samurai Sword":
                fill(200, 200, 100);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.japanese, this.x + 15, this.y);
                break;
            case "Shogun Weapon":
                fill(100, 200, 200);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.shogunate, this.x + 15, this.y);
                break;
            case "Industrial Wheels":
                fill(200, 200, 200);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.industrial, this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                break;
            case "Flamethrower":
                fill(100, 100, 100);
                strokeWeight(2);
                rect(this.x, this.y, this.width, this.height);
                strokeWeight(0);
                image(GameInfo.images.artifacts.information, this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                break;
            default:
                break;
        }
        // text(this.name, this.x + this.width / 2, this.y + this.height / 2);
    }

    hover() {
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
        let x = 0;
        let y = 0;
        if (this.entity == "Player") {
            for (let artifact of artifacts) {
                arts.push(new Artifact(artifact.name, artifact.desc, 60 + 90 * x, 200 + 90 * y, 80, 80));
                if (x == 0) {
                    x++;
                } else {
                    x = 0;
                    y++;
                }
            }
        } else if (this.entity == "Opponent") {
            for (let artifact of artifacts) {
                arts.push(new Artifact(artifact.name, artifact.desc, 1140 + 90 * x, 200 + 90 * y, 80, 80));
                if (x == 0) {
                    x++;
                } else {
                    x = 0;
                    y++;
                }
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
            textAlign(CENTER, CENTER);
            text(GameInfo.game.player.name + "'s", 140, 135);
            if (GameInfo.game.player.protected) {
                image(GameInfo.images.cards.shieldAnim, 20 + 245 / 2 + 80, 135 - 10, 20, 20);
            }
            text("Artifacts", 140, 170);
        } else if (this.entity == "Opponent") {
            fill(143, 121, 101, 125);
            rect(1100, 110, 245, 515, 5, 5, 5, 5)
            if (GameInfo.game.opponents[0].state == "Playing") {
                fill(255)
            }
            else {
                fill(0)
            }
            text(GameInfo.game.opponents[0].name + "'s", 1222, 135);
            if (GameInfo.game.opponents[0].protected) {
                image(GameInfo.images.cards.shieldAnim, 1100 + 245 / 2 - 90, 135 - 10, 20, 20);
            }
            text("Artifacts", 1222, 170);
        }

        for (let artifact of this.artifacts) {
            artifact.draw();
        }
    }

    hover() {
        if (this.entity == "Player") {
            for (let artifact of this.artifacts) {
                if (artifact.hover()) {
                    fill(255, 255, 255, 70)
                    rect(artifact.x, artifact.y, artifact.width, artifact.height);
                    fill(143, 121, 101, 250)
                    strokeWeight(2);
                    rect(artifact.x + artifact.width + 5, artifact.y - artifact.height + 60, 300, 125, 5, 5, 5, 5);
                    strokeWeight(0);
                    fill(0)
                    textStyle(BOLD);
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    stroke(0);
                    textSize(20)
                    text(artifact.name, artifact.x + artifact.width + 155, artifact.y + artifact.height / 2 - artifact.height + 60);
                    textSize(14)
                    text(artifact.desc + ".", artifact.x + artifact.width + 155, artifact.y + 75 - artifact.height + 60);
                }
            }

            if (mouseX > 20 + 245 / 2 + 80 && mouseX < 20 + 245 / 2 + 80 + 20 && mouseY > 135 - 10 && mouseY < 135 - 10 + 20 && GameInfo.game.player.protected) {
                fill(143, 121, 101, 250)
                strokeWeight(1);
                rect(80, 78, 290, 30, 5, 5, 5, 5)
                strokeWeight(0)
                fill(0)
                textSize(12)
                textAlign(LEFT, CENTER)
                text("This player is protected by an Action Shield card.", 85, 78 + 30 / 2)
            }
        } else if (this.entity == "Opponent") {
            for (let artifact of this.artifacts) {
                if (artifact.hover()) {
                    fill(255, 255, 255, 70)
                    rect(artifact.x, artifact.y, artifact.width, artifact.height);
                    fill(143, 121, 101, 250)
                    strokeWeight(2);
                    rect(artifact.x - 305, artifact.y - artifact.height + 60, 300, 125, 5, 5, 5, 5);
                    strokeWeight(0);
                    fill(0)
                    textStyle(BOLD);
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    stroke(0);
                    textSize(20)
                    text(artifact.name, artifact.x - 305 + 155, artifact.y + artifact.height / 2 - artifact.height + 60);
                    textSize(14)
                    text(artifact.desc + ".", artifact.x - 305 + 155, artifact.y + 75 - artifact.height + 60);
                }
            }

            if (mouseX > 1100 + 245 / 2 - 90 && mouseX < 1100 + 245 / 2 - 90 + 20 && mouseY > 135 - 10 && mouseY < 135 - 10 + 20 && GameInfo.game.opponents[0].protected) {
                fill(143, 121, 101, 210)
                strokeWeight(1);
                rect(980, 78, 290, 30, 5, 5, 5, 5)
                strokeWeight(0)
                fill(0)
                textSize(12)
                textAlign(LEFT, CENTER)
                text("This player is protected by an Action Shield card.", 985, 78 + 30 / 2)
            }
        }
    }
}