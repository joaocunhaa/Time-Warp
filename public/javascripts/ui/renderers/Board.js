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
        let position = positionToCoordinates(this.playerPosition);
        let playerPawnPosition = {x: position.x, y: position.y};
        position = positionToCoordinates(this.oppPosition);
        let oppPawnPosition = {x: position.x, y: position.y};

        //Draw Board
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
            for(let artifact of GameInfo.artifactsOnBoard){
                if(artifact.current_position == square){
                    text("X",this.x + 90 * right, this.y + 90 * down)
                }
            }
        }

        if(playerPawnPosition.x == oppPawnPosition.x && playerPawnPosition.y == oppPawnPosition.y){
            image(this.playerPawnImg,this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 40);
            image(this.oppPawnImg,this.x + 80 * oppPawnPosition.x, this.y + 40 + 80 * oppPawnPosition.y, 80, 40);
        }else{
            image(this.playerPawnImg,this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 80);
        image(this.oppPawnImg,this.x + 80 * oppPawnPosition.x, this.y + 80 * oppPawnPosition.y, 80, 80);
        }

        strokeWeight(0);
    }
    
}

function positionToCoordinates(position){
    let x = 0;
    let y = 0;
    for(let square = 1; square <= position; square++){
        if(square <= 7){
            x++;
        }else if(square <= 11){
            y++;
        }else if(square <= 17){
            x--;
        }else if(square <= 20){
            y--;
        }else if(square <= 25){
            x++;
        }else if(square <= 27){
            y++;
        }else if(square <= 31){
            x--;
        }else if(square <= 32){
            y--;
        }else if(square <= 35){
            x++;
        }
    }

    return{x: x, y: y}
}