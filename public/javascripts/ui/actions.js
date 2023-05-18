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
    GameInfo.playerLastPosition = positions.result.playerPawn.position - 1;
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
            GameInfo.sounds.pawn.play();
            await endturnAction();
        } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \n moving a pawn.", closeWarning);
    }
}

async function drawCardAction() {
    if(!GameInfo.clicked){
        GameInfo.clicked = true;
        let result = await requestDrawCard();
        if(result.maxCards){
            if(!GameInfo.warning) GameInfo.warning = new Warning("You can't have more than 5 cards.", closeWarning)
            GameInfo.clicked = false;
        }
        if (result.successful) {
            GameInfo.sounds.drawCard.play();
            await endturnAction();
        } else if(!GameInfo.warning) {GameInfo.warning = new Warning("Something went wrong when \n drawing a card.", closeWarning); GameInfo.clicked = false;}
    }
}

async function playCardAction(selectedCard) {
    if(!GameInfo.popUp) {
        if(selectedCard.name.length > 1) GameInfo.popUp = new PopUp(`Do you want to play "${selectedCard.name[0]} ${selectedCard.name[1]}" card?`, selectedCard.description,await cardAction, popUpCancelAction, selectedCard);
        else GameInfo.popUp = new PopUp(`Do you want to play "${selectedCard.name[0]}" card?`, selectedCard.description,cardAction, popUpCancelAction, selectedCard);
    };
}

async function dropCardAction(selectedCard) {
    if (confirm(`Do you want to drop the "${selectedCard.name}" card?`)) {
        let result = await requestDropCard(selectedCard.id);
        if (result.successful) {
            GameInfo.dropping = false;
            GameInfo.sounds.drawCard.play();
            await endturnAction();
        } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \ndropping a card.", closeWarning);
    }
}

async function surrendAction() {
    if (confirm(`Do you want to surrend?`)) {
        let result = await requestSurrend();
        if (!result.successful) {if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong surrendering", closeWarning)};
        await getGameInfo();
        GameInfo.prepareUI();
    }
}

//Secondary Actions
function popUpCancelAction(){
    GameInfo.popUp.close();
    GameInfo.popUp = null;
}

function closeWarning(){
    GameInfo.warning.close();
    GameInfo.warning = null;
}

async function cardAction(card){
    GameInfo.popUp.close();
    GameInfo.popUp = null;
    let result = await requestPlayCard(card.id);
    if (result.successful) {
        if(!GameInfo.warning) GameInfo.warning = new Warning(result.alert, closeWarning)
        // alert(result.alert);
        GameInfo.sounds.playCard.play();
        await endturnAction();
    } else {if(!GameInfo.warning) GameInfo.warning = new Warning(result.alert || "Something went wrong when \nplaying a card.", closeWarning); }
}

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
    } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \nending the turn.", closeWarning);
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \nclosing the score.", closeWarning);
}

//Cheats
async function drawCardCheat(selected_card) {
    let result = await requestDrawCardCheat(selected_card);
    if (!result.successful)
        if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \ndrawing a card.", closeWarning)
    GameInfo.sounds.drawCard.play();
    await getCards();
}

async function dropCardCheat() {
    if(!GameInfo.popUp) GameInfo.popUp = new PopUp(`Do you want to drop all your cards?`, "", dropAllCardsAction, popUpCancelAction, null);
}

async function collectAllArtifactsCheat() {
    if(!GameInfo.popUp) GameInfo.popUp = new PopUp(`Do you want to collect all artifacts?`, "", collectAllArtifactsAction, popUpCancelAction, null);
}

async function movePawnCheat() {
    let result = await requestMovePawn();
    if (!result.successful)
        if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \nmoving a pawn.", closeWarning);
    await getGameInfo();
    await getPawnsPositions();
    GameInfo.sounds.pawn.play();
}


// Cheats Actions
async function dropAllCardsAction(){
    let result = await requestDropCardCheat();
    if (result.successful) {
        GameInfo.sounds.drawCard.play();
        await getCards();
    } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \n dropping a card.", closeWarning);
    GameInfo.popUp.close();
    GameInfo.popUp = null;
}

async function collectAllArtifactsAction(){
    let result = await requestCollectArtifactsCheat();
    if (result.successful) {
        await getGameInfo();
        await getArtifactsOnBoard();
        await getCollectedArtifacts();
    } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \n collecting an artifact.", closeWarning);
    GameInfo.popUp.close();
    GameInfo.popUp = null;
}