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
        let result = await requestMovePawn(false);
        if (result.successful) {
            GameInfo.clicked = true;
            await getGameInfo();
            await getPawnsPositions();
            await getCards();
            await getCollectedArtifacts();
            await getArtifactsOnBoard();
            GameInfo.prepareUI();
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
            await getGameInfo();
            await getPawnsPositions();
            await getCards();
            await getCollectedArtifacts();
            await getArtifactsOnBoard();
            GameInfo.prepareUI();
        } else if(!GameInfo.warning) {GameInfo.warning = new Warning("Something went wrong when \n drawing a card.", closeWarning); GameInfo.clicked = false;}
    }
}

async function playCardAction(selectedCard) {
    if(!GameInfo.popUp && GameInfo.game.player.state == "Playing") {
        if(selectedCard.name.length > 1) GameInfo.popUp = new PopUp(`Do you want to play "${selectedCard.name[0]} ${selectedCard.name[1]}" card?`, selectedCard.description, cardAction, popUpCancelAction, selectedCard);
        else GameInfo.popUp = new PopUp(`Do you want to play "${selectedCard.name[0]}" card?`, selectedCard.description,cardAction, popUpCancelAction, selectedCard);
    };
}

async function dropCardAction(selectedCard) {
    if(selectedCard.name.length > 1) GameInfo.popUp = new PopUp(`Do you want to drop "${selectedCard.name[0]} ${selectedCard.name[1]}" card?`, "That will delete this card from your hand", dropAction, popUpCancelAction, selectedCard);
    else GameInfo.popUp = new PopUp(`Do you want to drop "${selectedCard.name[0]}" card?`, "That will delete this card from your hand", dropAction, popUpCancelAction, selectedCard);
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

async function dropAction(selectedCard){
    GameInfo.popUp.close();
    GameInfo.popUp = null;
    let result = await requestDropCard(selectedCard.id);
    if (result.successful) {
        GameInfo.dropping = false;
        GameInfo.sounds.drawCard.play();
        await getGameInfo();
        await getPawnsPositions();
        await getCards();
        await getCollectedArtifacts();
        await getArtifactsOnBoard();
        GameInfo.prepareUI();
    } else if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \ndropping a card.", closeWarning);
}

async function cardAction(card){
    GameInfo.popUp.close();
    GameInfo.popUp = null;
    GameInfo.animationSize = 0;
    
    let result = await requestPlayCard(card.id);
    if (result.successful) {
        if(!GameInfo.warning && result.alert) GameInfo.warning = new Warning(result.alert, closeWarning);
        console.log(result.alert);
        GameInfo.sounds.playCard.play();
        if(!GameInfo.warning){
            if(card.name[0] == "Time" && card.name[1] == "Jump")
                GameInfo.currentCardAnimation = GameInfo.images.cards.timeJumpAnim;
            else if(card.name[0] == "Time" && card.name[1] == "Reverse")
                GameInfo.currentCardAnimation = GameInfo.images.cards.timeReverseAnim;
            else if(card.name[0] == "Claim" && card.name[1] == "Artifact")
                GameInfo.currentCardAnimation = GameInfo.images.cards.claimArtifactAnim;
            else if(card.name[0] == "Drop" && card.name[1] == "Artifact" && !GameInfo.game.opponents[0].protected)
                GameInfo.currentCardAnimation = GameInfo.images.cards.dropArtifactAnim;
            else if(card.name[0] == "Action" && card.name[1] == "Shield")
                GameInfo.currentCardAnimation = GameInfo.images.cards.shieldAnim;
            else if(card.name[0] == "Switch")
                GameInfo.currentCardAnimation = GameInfo.images.cards.switchAnim;
            else if(card.name[0] == "Paradox")
                GameInfo.currentCardAnimation = GameInfo.images.cards.paradoxAnim;
            else console.log(card.name);
        }
        await getGameInfo();
        await getPawnsPositions();
        await getCards();
        await getCollectedArtifacts();
        await getArtifactsOnBoard();
        GameInfo.prepareUI();
    } else {if(!GameInfo.warning) GameInfo.warning = new Warning("Something went wrong when \nplaying a card.", closeWarning); }
}

async function changeDropMode() {
    if (!GameInfo.dropping)
        GameInfo.dropping = true;
    else GameInfo.dropping = false;
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
    let result = await requestMovePawn(true);
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