class Artifact{
    constructor(name, x, y, width, height){
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(){
        fill(255)
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height);
        strokeWeight(0);
        fill(0)
        textStyle(BOLD);
        textSize(14);
        textAlign(CENTER,CENTER);
        stroke(0);
        text(this.name,this.x+this.width/2,this.y+this.height/2);
    }
}