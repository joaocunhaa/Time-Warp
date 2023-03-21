
async function getGameInfo() {
    let result = await requestPlayerGame();
    await getArtifactsOnBoard();
    await getCollectedArtifacts();
    await getCards();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game); 
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
    }
}

async function getPawnsPositions(){
    let positions = await requestPawnsPositions();
    GameInfo.playerPosition = positions.result.playerPawn.position;
    GameInfo.oppPosition = positions.result.oppPawn.position;
    if (GameInfo.board) GameInfo.board.update(GameInfo.playerPosition, GameInfo.oppPosition); 
    else GameInfo.board = new Board(GameInfo.playerPosition, GameInfo.oppPosition, 350, 150, 600, 400, GameInfo.images.playerPawn, GameInfo.images.oppPawn);
}

async function movePawnAction() {
    let result = await requestMovePawn();
    if (result.successful) {
        await endturnAction();
    } else alert("Something went wrong when moving a pawn.");
}

async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        await  getPawnsPositions();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.");
}

async function getArtifactsOnBoard(){
    let artifactsOnBoard = await requestArtifactsOnBoard();
    GameInfo.artifactsOnBoard = artifactsOnBoard.result;
}

async function getCollectedArtifacts(){
    let collectedArtifacts = await requestCollectedArtifacts();
    let y = 0;
        let x = 0;
        for(let artifact of collectedArtifacts.result.playerArtifacts){
            if(y < 6 && y >= 4){
                y = 0;
                x++;
            }
            GameInfo.playerArtifacts.push(new Artifact(artifact.name, 20 + 140 * x, 230 + 60 * y, 130, 50));
            y++;
        }
        y = 0
        x = 0
        for(let artifact of collectedArtifacts.result.oppArtifacts){
            if(y < 6 && y >= 4){
                y = 0;
                x++;
            }
            GameInfo.playerArtifacts.push(new Artifact(artifact.name, 1230 - 140 * x, 230 + 60 * y, 130, 50));
            y++;
        }
}

async function getCards(){
    let result = await requestCards();
    if (GameInfo.playerDeck) GameInfo.playerDeck.update(result.result.playerCards); 
    else GameInfo.playerDeck = new Deck(result.result.playerCards, 370, 600, null);
}