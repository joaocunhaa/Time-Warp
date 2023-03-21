
async function refresh() {
    if (GameInfo.game.player.state == "Waiting") { 
        // Every time we are waiting
        await  getGameInfo();
        await  getPawnsPositions();
        if (GameInfo.game.player.state != "Waiting") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
        }
    } 
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

function preload() {
    GameInfo.images.playerPawn = loadImage("./assets/WhitePawn.png");
    GameInfo.images.oppPawn = loadImage("./assets/BlackPawn.png");
}


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    // preload  images
    
    await getGameInfo();
    await getPawnsPositions();
    setInterval(refresh,1000);

    //buttons (create a separated function if they are many)
    GameInfo.movePawn = createButton('Move Pawn');
    GameInfo.movePawn.parent('game');
    GameInfo.movePawn.position(GameInfo.width-150,GameInfo.height-50);
    GameInfo.movePawn.mousePressed(movePawnAction);
    GameInfo.movePawn.addClass('game')

    GameInfo.drawCard = createButton('Draw card');
    GameInfo.drawCard.parent('game');
    GameInfo.drawCard.position(GameInfo.width-150,GameInfo.height-100);
    GameInfo.drawCard.mousePressed(drawCardAction);
    GameInfo.drawCard.addClass('game')


    GameInfo.prepareUI();
    

    GameInfo.loading = false;
}

function draw() {
    background(220);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);
    } else {
        GameInfo.scoreBoard.draw();
        GameInfo.board.draw();
        GameInfo.playerDeck.draw();
        //Titles
        fill(0)
        textStyle(BOLD);
        textSize(24);
        textAlign(CENTER,CENTER);
        stroke(0);
        text("Opponent Artifacts:", 1250, 200);
        text("Your Artifacts:", 100, 200);
        //Draw Player Artifacts
        for(let artifact of GameInfo.playerArtifacts){
            artifact.draw();
        }
        //Draw Opponent Artifacts
        for(let artifact of GameInfo.oppArtifacts){
            artifact.draw();
        }
    }
}

async function mouseClicked() {
  
}

