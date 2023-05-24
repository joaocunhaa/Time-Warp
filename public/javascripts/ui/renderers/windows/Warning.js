class Warning extends Window{
    static x = GameInfo.width / 2 - 250;
    static y = GameInfo.height / 3;
    static width = 500;
    static height = 200;
    constructor(text, okAction){
        super(Warning.x, Warning.y, Warning.width, Warning.height);
        this.text = text;
        this.createButton("OK", Warning.x + Warning.width / 2, Warning.y + Warning.height - 50, () =>{ okAction() }, 100, 33);
    }

    draw(){
        if(this.opened){
            fill(160, 130, 120);
            super.draw();
            fill(0);
            textSize(20)
            text(this.text, Warning.x + Warning.width / 2, Warning.y + Warning.height / 2);
        }
    }
}