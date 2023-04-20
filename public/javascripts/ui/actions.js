//Get Functions
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game);
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(GameInfo.width / 2 - (GameInfo.width - 700) / 2, GameInfo.height / 2 - (GameInfo.height - 550) / 2, GameInfo.width - 700, GameInfo.height - 550, result.score, await closeScore);
        }
    }
}

async function getPawnsPositions() {
    let positions = await requestPawnsPositions();
    GameInfo.playerPosition = positions.result.playerPawn.position;
    GameInfo.oppPosition = positions.result.oppPawn.position;
    if (GameInfo.board) GameInfo.board.update(GameInfo.playerPosition, GameInfo.oppPosition);
    else GameInfo.board = new Board(GameInfo.playerPosition, GameInfo.oppPosition, 683 - 80 - 280, 170, 600, 400, GameInfo.images.playerPawn, GameInfo.images.oppPawn);
}

async function getArtifactsOnBoard() {
    let artifactsOnBoard = await requestArtifactsOnBoard();
    GameInfo.artifactsOnBoard = artifactsOnBoard.result;
}

async function getCollectedArtifacts() {
    let collectedArtifacts = await requestCollectedArtifacts();
    GameInfo.playerListArtifacts = new ListArtifacts("Player", collectedArtifacts.result.playerArtifacts);
    GameInfo.oppListArtifacts = new ListArtifacts("Opponent", collectedArtifacts.result.oppArtifacts);
}

async function getCards() {
    let result = await requestCards();
    if (GameInfo.playerDeck) GameInfo.playerDeck.update(result.result.playerCards);
    else GameInfo.playerDeck = new Deck(result.result.playerCards, 683 - 365 + 20, 600, await playCardAction);
}

// Buttons Actions
async function movePawnAction() {
    if(!GameInfo.clicked){
        let result = await requestMovePawn();
        if (result.successful) {
            GameInfo.clicked = true;
            await endturnAction();
        } else alert("Something went wrong when moving a pawn.");
    }
}

async function drawCardAction() {
    if(!GameInfo.clicked){
        GameInfo.clicked = true;
        let result = await requestDrawCard();
        if(result.maxCards){
            alert("You can't have more than 5 cards.");
            GameInfo.clicked = false;
        }
        if (result.successful) {
            await endturnAction();
        } else {alert("Something went wrong when drawing a card."); GameInfo.clicked = false;}
    }
}

async function playCardAction(selectedCard) {
    if(!GameInfo.clicked){
        GameInfo.clicked = true;
        if (confirm(`Do you want to play the "${selectedCard.name}" card?`)) {
            let result = await requestPlayCard(selectedCard.id);
            if (result.successful) {
                await endturnAction();
            } else {alert("Something went wrong when playing a card."); GameInfo.clicked = false;}
        }else{
            GameInfo.clicked = false;
        }
    }
}

async function dropCardAction(selectedCard) {
    if (confirm(`Do you want to drop the "${selectedCard.name}" card?`)) {
        let result = await requestDropCard(selectedCard.id);
        if (result.successful) {
            GameInfo.dropping = false;
            await endturnAction();
        } else alert("Something went wrong when dropping a card.");
    }
}

async function surrendAction() {
    if (confirm(`Do you want to surrend?`)) {
        let result = await requestSurrend();
        if (!result.successful) alert("Something went wrong surrending.");
        await getGameInfo();
        GameInfo.prepareUI();
    }
}

//Secondary Actions
async function changeDropMode() {
    if (!GameInfo.dropping)
        GameInfo.dropping = true;
    else GameInfo.dropping = false;
}

async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await getGameInfo();
        await getPawnsPositions();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.");
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when closing the score.")
}

//Cheats
async function drawCardCheat(selected_card) {
    let result = await requestDrawCardCheat(selected_card);
    if (!result.successful)
        alert("Something went wrong when drawing a card.");

    await getCards();
}

async function dropCardCheat() {
    if (confirm(`Do you want to drop all your cards?`)) {
        let result = await requestDropCardCheat();
        if (result.successful) {
            await getCards();
        } else alert("Something went wrong when dropping a card.");
    }
}

async function collectAllArtifactsCheat() {
    if (confirm(`Do you want to collect all artifacts?`)) {
        let result = await requestCollectArtifactsCheat();
        if (result.successful) {
            await getGameInfo();
            await getArtifactsOnBoard();
            await getCollectedArtifacts();
        } else alert("Something went wrong when collecting an artifact.");
    }
}

async function movePawnCheat() {
    let result = await requestMovePawn();
    if (!result.successful)
        alert("Something went wrong when moving a pawn.");
    await getGameInfo();
    await getPawnsPositions();
}