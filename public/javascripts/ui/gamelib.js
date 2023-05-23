async function refresh() {
    if(GameInfo.game.state != "Finished"){
        await getGameInfo();
        await getPawnsPositions();
        await getArtifactsOnBoard();
        await getCollectedArtifacts();
        await getCards();
        GameInfo.playerEra = Math.ceil(GameInfo.playerPosition / 5);
        if(GameInfo.currentTrack != GameInfo.sounds.bgSounds[GameInfo.playerEra - 1]){
            GameInfo.currentTrack.setVolume(0, 2.5)
            GameInfo.currentTrack = GameInfo.sounds.bgSounds[GameInfo.playerEra - 1];
            GameInfo.currentTrack.setVolume(0)
            GameInfo.currentTrack.loop();
            GameInfo.currentTrack.setVolume(0.5, 5.0)
        }else{
            if(!GameInfo.currentTrack.isLooping()){
                GameInfo.currentTrack.loop();
            }
        }
        GameInfo.prepareUI();
    }
}

function preload() {
    GameInfo.images.playerPawn = loadImage("./assets/WhitePawn.png");
    GameInfo.images.oppPawn = loadImage("./assets/BlackPawn.png");
    GameInfo.images.logo = loadImage("./assets/TimeWarpLogo.png");
    GameInfo.images.reverse = loadImage("./assets/reverse.png");
    // Background Images
    GameInfo.images.background = [];
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Egypt.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Greece.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Roman.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Japan.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Shogunate.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Industrial.jpg"));
    GameInfo.images.background.push(loadImage("./assets/Backgrounds/Information.jpg"));
    // Sounds of each era
    GameInfo.sounds.bgSounds = [];
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/egypt.mp3"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/greece.mp3"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/roman.wav"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/japan1.mp3"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/japan2.mp3"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/steampunk.mp3"));
    GameInfo.sounds.bgSounds.push(loadSound("./assets/sounds/futuristic.mp3"));
    // Sounds
    GameInfo.sounds.drawCard = loadSound("./assets/sounds/drawCard.mp3");
    GameInfo.sounds.playCard = loadSound("./assets/sounds/cardPower.mp3");
    GameInfo.sounds.pawn = loadSound("./assets/sounds/pawn.mp3");
    // Cards Images
    GameInfo.images.cards = {};
    GameInfo.images.cards.timeReverse = loadImage("./assets/cards/TimeReverse.png");
    GameInfo.images.cards.timeJump = loadImage("./assets/cards/TimeJump.png");
    GameInfo.images.cards.claimArtifact = loadImage("./assets/cards/ClaimArtifact.png");
    GameInfo.images.cards.dropArtifact = loadImage("./assets/cards/DropArtifact.png");
    GameInfo.images.cards.switch = loadImage("./assets/cards/Switch.png");
    GameInfo.images.cards.shield = loadImage("./assets/cards/ActionShield.png");
    GameInfo.images.cards.paradox = loadImage("./assets/cards/Paradox.png");
    //Cards Animations
    GameInfo.images.cards.timeReverseAnim = loadImage("./assets/cards/anims/time_reverseIMAGE.png");
    GameInfo.images.cards.timeJumpAnim = loadImage("./assets/cards/anims/time_jumpIMAGE.png");
    GameInfo.images.cards.claimArtifactAnim = loadImage("./assets/cards/anims/claim_artifactIMAGE.png");
    GameInfo.images.cards.dropArtifactAnim = loadImage("./assets/cards/anims/drop_artifactIMAGE.png");
    GameInfo.images.cards.switchAnim = loadImage("./assets/cards/anims/switchIMAGE.png");
    GameInfo.images.cards.shieldAnim = loadImage("./assets/cards/anims/action_shieldIMAGE.png");
    GameInfo.images.cards.paradoxAnim = loadImage("./assets/cards/anims/paradoxIMAGE.png");
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
    GameInfo.playerEra = Math.ceil(GameInfo.playerPosition / 5);
    GameInfo.currentTrack = GameInfo.sounds.bgSounds[GameInfo.playerEra - 1];
    setInterval(refresh, 100);

    //Buttons (create a separated function if they are many)
    GameInfo.movePawn = createButton('Move Pawn');
    GameInfo.movePawn.parent('game');
    GameInfo.movePawn.position(1070, 700);
    GameInfo.movePawn.mousePressed(movePawnAction);
    GameInfo.movePawn.addClass('game');

    GameInfo.drawCard = createButton('Draw card');
    GameInfo.drawCard.parent('game');
    GameInfo.drawCard.position(1070, 650);
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

async function draw() {
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width / 2, GameInfo.height / 2);
    } else if (GameInfo.game.state == "Finished" && GameInfo.scoreWindow) {
        GameInfo.scoreWindow.draw();
    } else {
        //BG
        background(GameInfo.images.background[GameInfo.playerEra - 1])
        GameInfo.scoreBoard.draw();
        GameInfo.board.draw();
        GameInfo.playerDeck.draw();
        GameInfo.playerListArtifacts.draw();
        GameInfo.oppListArtifacts.draw();
        if (GameInfo.playerListArtifacts && GameInfo.playerListArtifacts.artifacts.length > 0) {
            GameInfo.playerListArtifacts.hover();
        }
        if(GameInfo.oppListArtifacts && GameInfo.oppListArtifacts.artifacts.length > 0){
            GameInfo.oppListArtifacts.hover();
        }
        //LOGO
        image(GameInfo.images.logo, GameInfo.width / 2 - 290, 10, 580, 150);
        //Dropping Action
        if (GameInfo.dropping) {
            GameInfo.dropCard.elt.textContent = "Cancel"
        } else {
            GameInfo.dropCard.elt.textContent = "Drop Card"
        }
        //Pop-up
        if(GameInfo.popUp){
            GameInfo.popUp.open();
            GameInfo.popUp.draw();
        }
        //Warning
        if(GameInfo.warning){
            GameInfo.warning.open();
            GameInfo.warning.draw();
        }
        //Card Animation
        if(GameInfo.currentCardAnimation){
            tint(255,255,255,GameInfo.tintAnimation)
            image(GameInfo.currentCardAnimation, GameInfo.width / 2 - 75, GameInfo.height / 2 - 75, 150, 150);
            noTint();
            if(frameCount >= 60){
                animateCard();
            }
        }
        
    }
}

function animateCard(){
    if(!GameInfo.reversingAnimation){
        GameInfo.tintAnimation += 10;
        if(GameInfo.tintAnimation > GameInfo.animationTintMax){
            GameInfo.tintAnimation = GameInfo.animationTintMax;
            GameInfo.reversingAnimation = true;
        }
    }else{
        GameInfo.tintAnimation -= 10;
        if(GameInfo.tintAnimation <= 0){
            GameInfo.currentCardAnimation = null;
            GameInfo.reversingAnimation = false;
            GameInfo.tintAnimation = 0;
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
    else if(keyCode === 192)            //ç
        await drawCardCheat(6); //Switch
    else if(keyCode === 79)            //o
        await drawCardCheat(7); //Shield

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