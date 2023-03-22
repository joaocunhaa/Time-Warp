// Actions
async function requestEndTurn() {
    try {
        const response = await fetch(`/api/plays/endturn`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PATCH"
            });
        return { successful: response.status == 200 };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestArtifactsOnBoard() {
    try {
        const response = await fetch(`/api/arts`)
        let result = await response.json();
        return { result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestCollectedArtifacts() {
    try {
        const response = await fetch(`/api/arts/collected`)
        let result = await response.json();
        return { result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestPawnsPositions() {
    try {
        const response = await fetch(`/api/pawns`)
        let result = await response.json();
        return { result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestMovePawn() {
    try {
        const response = await fetch(`/api/pawns`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PATCH"
            });
        return { successful: response.status == 200 };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestCards() {
    try {
        const response = await fetch(`/api/cards`)
        let result = await response.json();
        return { result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestDrawCard() {
    try {
        const response = await fetch(`/api/cards/draw`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST"
            });
        return { successful: response.status == 200, maxCards: response.status == 400 };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}

async function requestPlayCard(selectedCard) {
    try {
        const response = await fetch(`/api/cards/play`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    selected_card: selectedCard
                }),
                method: "PATCH"
            });
        return { successful: response.status == 200 };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return { err: err };
    }
}