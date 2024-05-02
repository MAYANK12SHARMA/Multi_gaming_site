
let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let hitSound = new Audio('{% static "GAME_SOUNDS/whac-a-mole_sound2.mp3" %}');
let loseSound = new Audio('{% static "GAME_SOUNDS/whac-a-mole_sound3.mp3" %}');
let back = new Audio('{% static "GAME_SOUNDS/whac-a-mole_sound1.mp3" %}');

window.onload = function() {
    setGame();
    back.loop = true;
    back.play();
}

function setGame() { 
    // Set up the grid in html
    for (let i = 0; i <9 ; i++) { 
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 1300);
    setInterval(setPlant, 2000);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString(); 
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "../GAME_IMAGES/whac-a-mole_Image3.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "../GAME_IMAGES/whac-a-mole_Image4.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();
        hitSound.playbackRate = 1.5;
        hitSound.play(); 
    }
    else if (this == currPlantTile) {
        back.pause()
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); 
        gameOver = true;
        loseSound.loop = true;
        loseSound.play();
    }
}

function restartGame() {
    location.reload();
}