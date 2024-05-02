

console.log("Welcome to Tic Tac Toe")
let music = new Audio("music.mp3")
let audioTurn = new Audio("ting.mp3")
audioTurn.playbackRate = 1.5;
let gameover = new Audio("gameover.mp3")
let turn = "X"
let isgameover = false;

//! Function to change the turn 
const changeTurn = ()=>{
    return turn === "X"? "O": "X"
}

//! Function to check for a win
const checkWin = ()=>{
    let boxtext = document.getElementsByClassName('boxtext'); 
    let wins = [
        [0, 1, 2, -1, 6, 0],
        [3, 4, 5, -1, 18, 0],
        [6, 7, 8, -1, 30, 0],
        [0, 3, 6, -13, 18, 90],
        [1, 4, 7, -1, 18, 90],
        [2, 5, 8, 11, 18, 90],
        [0, 4, 8, -1, 18, 45],
        [2, 4, 6, -1, 18, 135],
    ]
    wins.forEach(e =>{
        if((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== "") ){ 
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won"
            isgameover = true 
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "340px";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`
            document.querySelector(".line").style.width = "38vw";

            //! The query selector returns the first child element that matches a specified selector(s) of an   element.
        }
    })
}


//!  Game Logic
let boxes = document.getElementsByClassName("box"); 
Array.from(boxes).forEach(element =>{
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', ()=>{
        if(boxtext.innerText === ''){
            boxtext.innerText = turn;
            turn = changeTurn();
            audioTurn.play();
            checkWin(); 
            if (!isgameover){
                document.getElementsByClassName("info")[0].innerText  = "Turn of " + turn;
            } 
        }
    })
})


//!  Onclick listener to reset button
reset.addEventListener('click', ()=>{ 
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = ""
    });
    turn = "X"; 
    isgameover = false 
    document.querySelector(".line").style.width = "0vw";
    document.getElementsByClassName("info")[0].innerText  = "Turn of " + turn;
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px" 
})