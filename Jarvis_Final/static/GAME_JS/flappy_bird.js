
    //board
    let board;
    let boardWidth = 1510;
    let boardHeight = 680;
    let context;

    //bird
    let birdWidth = 53; //width/height ratio = 1510/680 = 2.22
    let birdHeight = 56;
    let birdX = boardWidth/8;
    let birdY = boardHeight/2;
    let birdImg;

    let bird = {
        x : birdX,
        y : birdY,
        width : birdWidth,
        height : birdHeight
    }

    //pipes
    let pipeArray = [];
    let pipeWidth = 64; 
    let pipeHeight = 512;
    let pipeX = boardWidth;
    let pipeY = 0;

    let topPipeImg;
    let bottomPipeImg;

    //physics
    let velocityX = -2; //pipes moving left speed
    let velocityY = 0; //bird jump speed
    let gravity = 0.4;

    let gameOver = false;
    let score = 0;

    function playBackgroundMusic() { 
        var backgroundMusic = document.getElementById("backgroundMusic");
        backgroundMusic.play();
    }

    window.onload = function() {
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d"); //used for drawing on the board

        playBackgroundMusic();

        //load images
        birdImg = new Image();
        birdImg.src = "../GAME_IMAGES/flappy_bird_Image2.png";
        birdImg.onload = function() {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }

        topPipeImg = new Image();
        topPipeImg.src = "../GAME_IMAGES/flappy_bird_Image4.png";

        bottomPipeImg = new Image();
        bottomPipeImg.src = "../GAME_IMAGES/flappy_bird_Image3.png";

        requestAnimationFrame(update);
        setInterval(placePipes, 1500); //every 1.5 seconds
        document.addEventListener("keydown", moveBird);
    }

    /*for applying the sound effect*/

    // Play flap sound
    function playFlapSound() {
        var flapSound = document.getElementById("flapSound");
        flapSound.playbackRate = 2.5; 
        flapSound.play();
    }

    // Play collision sound
    function playCollisionSound() {
        var collisionSound = document.getElementById("collisionSound");
        collisionSound.playbackRate = 1.5;
        collisionSound.play();
    }

    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            playFlapSound();
        }
    });
    // Call these functions at appropriate game events
    // For example, when the bird flaps or when collision occurs

    function update() {
        requestAnimationFrame(update);
        if (gameOver) {
            return;
        }
        context.clearRect(0, 0, board.width, board.height);

        //bird
        velocityY += gravity;
        // bird.y += velocityY;
        bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        if (bird.y > board.height) {
            gameOver = true;
        }

        //pipes
        for (let i = 0; i < pipeArray.length; i++) { 
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
                pipe.passed = true;
            }

            if (detectCollision(bird, pipe)){
                gameOver = true;
                playCollisionSound();
            }
        }

        //clear pipes
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift(); //removes first element from the array
        }

        //score
        context.fillStyle = "Black";
        context.font="29px Cursive";
        context.fillText(score, 690, 45);

        if (gameOver) {
            context.fillStyle = "purple";
            context.fillText("GAME OVER !!", 610, 115);

            context.fillStyle = "purple";
            context.fillRect(0,155, boardWidth, 69);

            context.fillStyle = "yellow";
            context.fillText("PRESS 'SPACE BAR' FOR RESTART ", 510, 200);
        }
    }

    function placePipes() {
        if (gameOver) {
            return;
        }

        let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
        let openingSpace = board.height/4;

        let topPipe = {
            img : topPipeImg,
            x : pipeX,
            y : randomPipeY,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(topPipe);

        let bottomPipe = {
            img : bottomPipeImg,
            x : pipeX,
            y : randomPipeY + pipeHeight + openingSpace,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(bottomPipe);
    }

    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" ) {
            //jump
            velocityY = -6;

            //reset game
            if (gameOver) {
                bird.y = birdY;
                pipeArray = [];
                score = 0;
                gameOver = false;
            }
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
            a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
    }

/* For Resume and Restart Button*/
document.getElementById("resumeBtn").addEventListener("click", function() {
    playBackgroundMusic();
    document.getElementById("resumeBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
    gameOver = false;
    update();
});

document.getElementById("restartBtn").addEventListener("click", function() {
    playBackgroundMusic();
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    document.getElementById("resumeBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
    update();
});