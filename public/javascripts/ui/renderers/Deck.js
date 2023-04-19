const maxCards = 5;
class Card{
    static width = 130;
    static height = 180;
    constructor(id, name, x, y){
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    draw(){
        stroke(0);
        strokeWeight(2);
        if(GameInfo.game.player.state == "Playing") {
            if(GameInfo.dropping){
                fill(150,50,50);
            }else fill(255);
        }else fill(200);
        rect(this.x, this.y, Card.width, Card.height);
        strokeWeight(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(18)
        text(this.name, this.x + Card.width/2, this.y + Card.height/2);
    }

    click() {
        return mouseX > this.x && mouseX < this.x+Card.width &&
               mouseY > this.y && mouseY < this.y+Card.height;
    }
}

class Deck{
    constructor(cardsInfo, x, y, clickAction){
        this.x = x;
        this.y = y;
        this.cards = this.createCards(cardsInfo);
        this.clickAction = clickAction;
    }

    createCards(cardsInfo){
        let cards = [];
        let x = this.x;
        for(let card of cardsInfo){
            cards.push(new Card(card.id, card.name, x, this.y));
            x+= 140;
        }
        return cards
    }

    update(cardsInfo){
        this.cards = this.createCards(cardsInfo);
    }

    draw(){
        fill(143, 121, 101, 125);
        rect(this.x-20, this.y-10, 730, 200, 5, 5, 5, 5)
        for (let card of this.cards) {
            card.draw();
        }
        fill(255);
    }

    click() {
        if (this.clickAction) {
            if(!GameInfo.dropping){
                for (let card of this.cards) {
                    if (card.click()) {
                        this.clickAction(card);
                    } 
                }
            }else{
                for (let card of this.cards) {
                    if (card.click()) {
                        dropCardAction(card);
                    } 
                }
            }
        }
    }
}