async function refresh() {
    if(GameInfo.game.state != "Finished"){
        await getGameInfo();
        await getPawnsPositions();
        await getArtifactsOnBoard();
        await getCollectedArtifacts();
        await getCards();
        GameInfo.prepareUI();
    }
}

function preload() {
    GameInfo.images.playerPawn = loadImage("./assets/WhitePawn.png");
    GameInfo.images.oppPawn = loadImage("./assets/BlackPawn.png");
    GameInfo.images.logo = loadImage("./assets/TimeWarpLogo.png");
    GameInfo.images.background = loadImage("./assets/Background.png")
}

async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');

    //Preload images
    await getGameInfo();
    await getPawnsPositions();
    await getArtifactsOnBoard();
    await getCollectedArtifacts();
    await getCards();
    setInterval(refresh, 500);

    //Buttons (create a separated function if they are many)
    GameInfo.movePawn = createButton('Move Pawn');
    GameInfo.movePawn.parent('game');
    GameInfo.movePawn.position(1070, 725);
    GameInfo.movePawn.mousePressed(movePawnAction);
    GameInfo.movePawn.addClass('game');

    GameInfo.drawCard = createButton('Draw card');
    GameInfo.drawCard.parent('game');
    GameInfo.drawCard.position(1070, 675);
    GameInfo.drawCard.mousePressed(drawCardAction);
    GameInfo.drawCard.addClass('game');

    GameInfo.dropCard = createButton('Drop Card');
    GameInfo.dropCard.parent('game');
    GameInfo.dropCard.position(155, 675);
    GameInfo.dropCard.mousePressed(changeDropMode);
    GameInfo.dropCard.addClass('game')

    GameInfo.surrend = createButton('Surrender');
    GameInfo.surrend.parent('game');
    GameInfo.surrend.position(1191, 25);
    GameInfo.surrend.mousePressed(surrendAction);
    GameInfo.surrend.addClass('game')

    GameInfo.prepareUI();

    GameInfo.loading = false;
}

function draw() {
    background(GameInfo.images.background);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width / 2, GameInfo.height / 2);
    } else if (GameInfo.game.state == "Finished" && GameInfo.scoreWindow) {
        GameInfo.scoreWindow.draw();
    } else {
        GameInfo.scoreBoard.draw();
        GameInfo.board.draw();
        GameInfo.playerDeck.draw();
        GameInfo.playerListArtifacts.draw();
        GameInfo.oppListArtifacts.draw();
        image(GameInfo.images.logo, GameInfo.width / 2 - 290, 10, 580, 150);
        if (GameInfo.dropping) {
            GameInfo.dropCard.elt.textContent = "Cancel"
        } else {
            GameInfo.dropCard.elt.textContent = "Drop Card"
        }
    }
}

async function mouseClicked() {
    if (GameInfo.playerDeck) {
        GameInfo.playerDeck.click();
    }
}

async function keyPressed(){
    //Draw Specific Card Cheat
    if(keyCode === 71)                  //g
        await drawCardCheat(1); //Claim Arfifact
    else if(keyCode === 72)             //h
        await drawCardCheat(2); //Drop Arfifact
    else if(keyCode === 74)             //j
        await drawCardCheat(3); //Time Jump
    else if(keyCode === 75)             //k
        await drawCardCheat(4); //Time Reverse
    else if(keyCode === 76)             //l
        await drawCardCheat(5); //Paradox
    else if(keyCode === 186)            //ç
        await drawCardCheat(6); //Switch

    //Drop All Cards Cheat
    else if(keyCode === 80)             //p
        await dropCardCheat();
    
    //Collect All Artifacts Cheat
    else if (keyCode === 85)            //u
        await collectAllArtifactsCheat();

    //Move Pawn without pass turn cheat
    else if (keyCode === 77)            //m
        await movePawnCheat();
}