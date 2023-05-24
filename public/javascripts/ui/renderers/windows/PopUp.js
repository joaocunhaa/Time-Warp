class PopUp extends Window{
    static x = GameInfo.width / 2 - 250;
    static y = GameInfo.height / 3;
    static width = 500;
    static height = 200;
    constructor(title, text, confirmAction, cancelAction, selectedCard){
        super(PopUp.x, PopUp.y, PopUp.width, PopUp.height);
        // Datas
        this.title = title
        this.text = text;
        // Buttons
        if(selectedCard != null){
            this.selectedCard = selectedCard;
            this.createButton("OK", PopUp.x + PopUp.width / 2 - 75, PopUp.y + PopUp.height - 50, () => { confirmAction(selectedCard); }, 100, 33);
        }else {this.createButton("OK", PopUp.x + PopUp.width / 2 - 75, PopUp.y + PopUp.height - 50, () => { confirmAction(); }, 100, 33);}
        
        this.createButton("Cancel", PopUp.x + PopUp.width / 2 + 75, PopUp.y + PopUp.height - 50, cancelAction, 100, 33);
    }

    draw(){
        if(this.opened){
            fill(160, 130, 120);
            super.draw();
            fill(0);
            textSize(24)
            text(this.title, PopUp.x + PopUp.width / 2, PopUp.y + PopUp.height / 3)
            textSize(14)
            text(this.text + ".", PopUp.x + PopUp.width / 2, PopUp.y + PopUp.height / 2);
        }
    }
}