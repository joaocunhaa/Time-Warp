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
        let playerPawnPosition = { x: position.x, y: position.y };

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
            rect(this.x + 80 * right, this.y + 80 * down, 80, 80);
            // Write the block number
            text(square, this.x + 80 * right + 10, this.y + 80 * down + 40)
            // Draw x's on artifacts positions
            for (let artifact of GameInfo.artifactsOnBoard) {
                if (artifact.current_position == square) {
                    if(artifact.drop_user == GameInfo.game.player.id && !GameInfo.game.player.touched_final){
                        fill(65);
                        text("X", this.x + 80 * right + 40, this.y + 80 * down + 40);
                        fill(0);
                    }else text("X", this.x + 80 * right + 40, this.y + 80 * down + 40);
                }
            }
        }

        if (playerPawnPosition.x == oppPawnPosition.x && playerPawnPosition.y == oppPawnPosition.y) {
            image(this.playerPawnImg, this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 40);
            image(this.oppPawnImg, this.x + 80 * oppPawnPosition.x, this.y + 40 + 80 * oppPawnPosition.y, 80, 40);
        } else {
            image(this.playerPawnImg, this.x + 80 * playerPawnPosition.x, this.y + 80 * playerPawnPosition.y, 80, 80);
            image(this.oppPawnImg, this.x + 80 * oppPawnPosition.x, this.y + 80 * oppPawnPosition.y, 80, 80);
        }

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
        fill(100, 100, 200)
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