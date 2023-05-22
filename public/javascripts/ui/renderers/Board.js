const nSquares = 35;
class Board {
    static headery = 50;

    constructor(playerPosition, oppPosition, x, y, width, height, playerPawnImg, oppPawnImg) {
        this.playerPosition = playerPosition;
        this.oppPosition = oppPosition;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.playerPawnImg = playerPawnImg;
        this.oppPawnImg = oppPawnImg;
        if (!GameInfo.game.player.reversed_direction)
            this.playerNextPosition = playerPosition + 1
        else
            this.playerNextPosition = playerPosition - 1
    }

    update(playerPosition, oppPosition) {
        this.playerPosition = playerPosition;
        this.oppPosition = oppPosition;
        if (!GameInfo.game.player.reversed_direction)
            this.playerNextPosition = playerPosition + 1
        else
            this.playerNextPosition = playerPosition - 1
    }

    draw() {
        strokeWeight(5);
        let down = 0;
        let right = 0;
        
        let position = positionToCoordinates(this.playerPosition);
        let playerPawnPosition = { x: position.x, y: position.y };
        let nextPosition = positionToCoordinates(this.playerNextPosition);

        position = positionToCoordinates(this.oppPosition);
        let oppPawnPosition = { x: position.x, y: position.y };

        //Draw Board
        for (let square = 1; square <= nSquares; square++) {
            if (square <= 7) {
                right++;
            } else if (square <= 11) {
                down++;
            } else if (square <= 17) {
                right--;
            } else if (square <= 20) {
                down--;
            } else if (square <= 25) {
                right++;
            } else if (square <= 27) {
                down++;
            } else if (square <= 31) {
                right--;
            } else if (square <= 32) {
                down--;
            } else if (square <= 35) {
                right++;
            }

            changeEras(square);
            // Draw the block
            stroke(0)
            strokeWeight(1);
            rect(this.x + 80 * right, this.y + 80 * down, 80, 80);
            // Write the block number
            strokeWeight(5);
            text(square, this.x + 80 * right + 10, this.y + 80 * down + 40)
            // Draw x's on artifacts positions
            for (let artifact of GameInfo.artifactsOnBoard) {
                if (artifact.current_position == square) {
                    text("X", this.x + 80 * right + 40, this.y + 80 * down + 40);
                }
            }
        }

        if (playerPawnPosition.x == oppPawnPosition.x && playerPawnPosition.y == oppPawnPosition.y) {
            image(this.playerPawnImg, this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 40);
            image(this.oppPawnImg, this.x + 80 * oppPawnPosition.x, this.y + 40 + 80 * oppPawnPosition.y, 80, 40);
            //Draw UI direction for player
            if(this.playerPosition == 1 || this.playerPosition == 35){
                image(GameInfo.images.reverse, (this.x + 80 * playerPawnPosition.x) + 20, (this.y + 80 * playerPawnPosition.y)+20, 40, 40);
            }else if(nextPosition.y > playerPawnPosition.y){
                //Baixo
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+30,(this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+50)
            }else if(nextPosition.y < playerPawnPosition.y){
                //Cima
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+30,(this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30)
            }else if(nextPosition.x > playerPawnPosition.x){
                //Direita
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+40,(this.y + 80 * playerPawnPosition.y)+50, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40)
            }else if(nextPosition.x < playerPawnPosition.x){
                //Esquerda
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+40,(this.y + 80 * playerPawnPosition.y)+50, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30, (this.x + 80 * playerPawnPosition.x)+30, (this.y + 80 * playerPawnPosition.y)+40)
            }
        } else {
            image(this.playerPawnImg, this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 80);
            image(this.oppPawnImg, this.x + 80 * oppPawnPosition.x, this.y + 80 * oppPawnPosition.y, 80, 80);
            //Draw UI direction for player
            if(this.playerPosition == 1 || this.playerPosition == 35){
                image(GameInfo.images.reverse, (this.x + 80 * playerPawnPosition.x) + 20, (this.y + 80 * playerPawnPosition.y)+20, 40, 40);
            }else if(nextPosition.y > playerPawnPosition.y){
                //Baixo
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+30,(this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+50)
            }else if(nextPosition.y < playerPawnPosition.y){
                //Cima
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+30,(this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30)
            }else if(nextPosition.x > playerPawnPosition.x){
                //Direita
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+40,(this.y + 80 * playerPawnPosition.y)+50, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30, (this.x + 80 * playerPawnPosition.x)+50, (this.y + 80 * playerPawnPosition.y)+40)
            }else if(nextPosition.x < playerPawnPosition.x){
                //Esquerda
                strokeWeight(1)
                fill(255)
                triangle((this.x + 80 * playerPawnPosition.x)+40,(this.y + 80 * playerPawnPosition.y)+50, (this.x + 80 * playerPawnPosition.x)+40, (this.y + 80 * playerPawnPosition.y)+30, (this.x + 80 * playerPawnPosition.x)+30, (this.y + 80 * playerPawnPosition.y)+40)
            }
        }

        fill(0)
        stroke(0)
        strokeWeight(5)
        line(this.x + 80 ,    this.y,          this.x + 80 * 8,    this.y);
        line(this.x + 80 * 8, this.y,          this.x + 80 * 8,    this.y + 80 * 5);
        line(this.x + 80,     this.y + 80 * 5, this.x + 80 * 8,    this.y + 80 * 5);
        line(this.x + 80,     this.y + 80 * 5, this.x + 80,        this.y + 80);
        line(this.x + 80,     this.y + 80,     this.x + 80 * 7,    this.y + 80);
        line(this.x + 80 * 7, this.y + 80 * 4, this.x + 80 * 7,    this.y + 80);
        line(this.x + 80 * 2, this.y + 80 * 4, this.x + 80 * 7,    this.y + 80 * 4);
        line(this.x + 80 * 2, this.y + 80 * 4, this.x + 80 * 2,    this.y + 80 * 2);
        line(this.x + 80 * 2, this.y + 80 * 2, this.x + 80 * 6,    this.y + 80 * 2);
        line(this.x + 80 * 6, this.y + 80 * 3, this.x + 80 * 6,    this.y + 80 * 2);
        line(this.x + 80 * 3, this.y + 80 * 3, this.x + 80 * 6,    this.y + 80 * 3);

        strokeWeight(0);
    }

}

// Detects the player's positions and transforms it into coordinates
function positionToCoordinates(position) {
    let x = 0;
    let y = 0;
    for (let square = 1; square <= position; square++) {
        if (square <= 7) {
            x++;
        } else if (square <= 11) {
            y++;
        } else if (square <= 17) {
            x--;
        } else if (square <= 20) {
            y--;
        } else if (square <= 25) {
            x++;
        } else if (square <= 27) {
            y++;
        } else if (square <= 31) {
            x--;
        } else if (square <= 32) {
            y--;
        } else if (square <= 35) {
            x++;
        }
    }

    return { x: x, y: y }
}

function changeEras(square) {
    if (square <= 5) {
        fill(100, 200, 100);
    } else if (square <= 10) {
        fill(200, 100, 100);
    } else if (square <= 15) {
        fill(100, 100, 200);
    } else if (square <= 20) {
        fill(200, 200, 100);
    } else if (square <= 25) {
        fill(100, 200, 200);
    } else if (square <= 30) {
        fill(200, 200, 200);
    } else if (square <= 35) {
        fill(100, 100, 100);
    }
}