const maxCards = 5;
class Card {
    static width = 130;
    static height = 180;
    constructor(id, name, description, img, x, y) {
        this.id = id;
        this.name = name.split(" ");
        this.description = description;
        this.img = img;
        this.x = x;
        this.y = y;
        this.hovered = false;
    }

    draw() {
        if(mouseX > this.x && mouseX < this.x + Card.width && mouseY > this.y && mouseY < this.y + Card.height && !this.hovered){
            this.y -= 20;
            this.hovered = true;
        }else if(!this.hovered){
            this.y = this.y;
            this.hovered = false;
        }
        stroke(0);
        strokeWeight(2);
        if (GameInfo.game.player.state == "Playing") {
            if (GameInfo.dropping) {
                fill(150, 50, 50);
            } else fill(255);
        } else fill(200);
        image(this.img, this.x, this.y, Card.width, Card.height);
        strokeWeight(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(18)
        if(this.name.length > 1){
           text(this.name[0], this.x + Card.width / 2, this.y + Card.height / 1.65);
           text(this.name[1], this.x + Card.width / 2, this.y + Card.height / 1.37);
        }else{
            text(this.name[0], this.x + Card.width / 2, this.y + Card.height / 1.55);
        }        
    }

    click() {
        return mouseX > this.x && mouseX < this.x + Card.width &&
            mouseY > this.y && mouseY < this.y + Card.height;
    }
}

class Deck {
    constructor(cardsInfo, x, y, clickAction) {
        this.x = x;
        this.y = y;
        this.cards = this.createCards(cardsInfo);
        this.clickAction = clickAction;
    }

    createCards(cardsInfo) {
        let cards = [];
        let x = this.x;
        for (let card of cardsInfo) {
            // Select Image
            let image;
            if(card.name == "Time Reverse") image = GameInfo.images.cards.timeReverse;
            else if(card.name == "Time Jump") image = GameInfo.images.cards.timeJump;
            else if(card.name == "Claim Artifact") image = GameInfo.images.cards.claimArtifact;
            else if(card.name == "Drop Artifact") image = GameInfo.images.cards.dropArtifact;
            else if(card.name == "Paradox") image = GameInfo.images.cards.paradox;
            else if(card.name == "Switch") image = GameInfo.images.cards.switch;
            else if(card.name == "Action Shield") image = GameInfo.images.cards.shield;
            cards.push(new Card(card.id, card.name, card.description, image, x, this.y));
            x += 140;
        }
        return cards
    }

    update(cardsInfo) {
        this.cards = this.createCards(cardsInfo);
    }

    draw() {
        fill(143, 121, 101, 125);
        rect(this.x - 20, this.y - 10, 730, 200, 5, 5, 5, 5)
        for (let card of this.cards) {
            card.draw();
        }
        fill(255);
    }

    click() {
        if (this.clickAction) {
            if (!GameInfo.dropping) {
                for (let card of this.cards) {
                    if (card.click()) {
                        this.clickAction(card);
                    }
                }
            } else {
                for (let card of this.cards) {
                    if (card.click()) {
                        dropCardAction(card);
                    }
                }
            }
        }
    }
}