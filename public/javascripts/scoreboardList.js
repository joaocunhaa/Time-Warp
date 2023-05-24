window.onload = async function () {
    let result = await checkAuthenticated(true);
    if (result.err) { throw result.err; }
    document.getElementById('player').textContent = "Hello " + window.user.name;
    result = await requestScores();
    if (!result.successful || result.err) {
        alert("Something wrong. Going to login page");
        window.location.pathname = "/index.html"
    }
    await fillScores(result.scores);
}

async function fillScores(scores) {
    let container = document.getElementById("scores");
    for (let score of scores) {
        let elem = document.createElement("section");
        for (let player of score.playerScores) {
            let p = document.createElement("p");
            p.textContent = "GAME " + score.gameId + " - You " + " " + player.state;
            elem.appendChild(p);

            if (player.state == "Won") {
                elem.setAttribute("class", "won");
            } else if (player.state == "Lost") {
                elem.setAttribute("class", "lost");
            }
        }
        container.appendChild(elem);
    }
}

async function logout() {
    try {
        let result = await requestLogout();
        if (!result.successful || result.err)
            throw result.err || { err: "Not successfull" }
        window.location.pathname = "/index.html"
    } catch (err) {
        console.log(err);
        // alert("Something is not working");
    }
}