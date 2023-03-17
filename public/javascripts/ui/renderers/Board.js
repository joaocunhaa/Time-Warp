const nSquares = 35;
class Board {
    static headery = 50;

    constructor(playerPosition, oppPosition, x, y, width, height,playerPawnImg, oppPawnImg) {
        this.playerPosition = playerPosition;
        this.oppPosition = oppPosition;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.playerPawnImg = playerPawnImg;
        this.oppPawnImg = oppPawnImg;
        /// precomputed
    }

    update(playerPosition, oppPosition) {
        this.playerPosition = playerPosition;
        this.oppPosition = oppPosition;
    }
    draw() {
        
        strokeWeight(5);
        let down = 0;
        let right = 0;
        for(let square = 1; square <= nSquares; square++){
            if(square <= 7){
                fill(100,200,100);
                right++;
            }else if(square <= 11){
                fill(200,100,100);
                down++;
            }else if(square <= 17){
                fill(100,100,200)
                right--;
            }else if(square <= 20){
                fill(200,200,100);
                down--;
            }else if(square <= 25){
                fill(100,200,200);
                right++;
            }else if(square <= 27){
                fill(200,200,200);
                down++;
            }else if(square <= 31){
                fill(100,100,100);
                right--;
            }else if(square <= 32){
                fill(50,100,100);
                down--;
            }else if(square <= 35){
                fill(50,50,200);
                right++;
            }
            rect(this.x + 80 * right, this.y + 80 * down, 80, 80);
            text(square,this.x + 85 * right, this.y + 85 * down)
            if(square == this.playerPosition){
                image(this.playerPawnImg, 0, 0, 80, 80, 0, 0, this.playerPawnImg.width, this.playerPawnImg.height);
            }
        }
        strokeWeight(0);
    }
}