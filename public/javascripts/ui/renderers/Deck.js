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
        if(GameInfo.game.player.state == "Playing") fill(255);
        else fill(200);
        rect(this.x, this.y, Card.width, Card.height);
        strokeWeight(0);
        fill(0);
        textAlign(CENTER, CENTER);
        text(this.name, this.x + Card.width/2, this.y + Card.height/2);
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
        fill(180);
        rect(this.x-20, this.y-10, 730, 200)
        for (let card of this.cards) {
            card.draw();
        }
        fill(255);
    }
}