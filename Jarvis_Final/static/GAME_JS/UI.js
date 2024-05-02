
export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 40;
        this.fontFamily = 'Bangers';
        this.lifeImage = document.getElementById('life');
        this.lifeSpacing = -12;
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowOpacity = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        let gap = ' ';
        //! score 
        context.font = this.fontSize * 1.3 + 'px ' + this.fontFamily;
        context.fillText('Score: ' + this.game.score, 30, 70);
        //! time
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time :  ' + (this.game.time * 0.001).toFixed(2), 45, 125);
        //! lives
        for(let i = 0; i < this.game.lives; i++) context.drawImage(this.lifeImage, 30 * i + 1380 + (this.lifeSpacing * (this.game.lives - i)), 15, 30, 30);
        //! gameover message 
        if (this.game.gameOver) {
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score >= this.game.winningScore){
                context.fillText("Let's go!🫡", this.game.width * 0.37, this.game.height * 0.15);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText("Who's the boss now, huh??", this.game.width * 0.43, this.game.height * 0.218);
            } else {
                context.fillText('Kyaaa yaar??🤦', this.game.width * 0.37, this.game.height * 0.15);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText("Tumse  na  hopayega  babuji!!", this.game.width * 0.43, this.game.height * 0.218);
            }
        }
        context.restore();
    }
}