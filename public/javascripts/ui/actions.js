
async function getGameInfo() {
    let result = await requestPlayerGame();
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
    else GameInfo.board = new Board(GameInfo.playerPosition, GameInfo.oppPosition, 400, 120, 600, 400, GameInfo.images.playerPawn, GameInfo.images.oppPawn);
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