// Note:
// position of objects in this program is in unit length,
// i.e., if the coodinates of an object is [1, 1],
// it refers to [1*BLOCK_WIDTH, 1*BLOCK_HEIGHT] on the canvas

// size of each block
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;

// row & column of the block-background
var ROW = 6;
var COLUMN = 5;

// size of canvas
var WIDTH = BLOCK_WIDTH * COLUMN;
var HEIGHT = BLOCK_HEIGHT * ROW + 100;

// initial position of the player
var PLAYER_X = 2;
var PLAYER_Y = 5;

// enemys' offset on y-axis for them to stay middle vertically with a block
var ENEMY_Y_OFFSET = -0.2;

// define an array to store blocks occupied by other elements -- such as rocks,
// other players that the currentPlayer can't get in
// element format: [x, y], represents coodinates of the block's top left corner
// var occupiedBlock = [];

// Enemies our currentPlayer must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // initialize position of a Enemy
    // x: set the Enemy to be out of the canvas
    // y: set the Enemy to be in a random row of 3 stone rows
    this.x = -3 + 2 * Math.random();
    this.y = ENEMY_Y_OFFSET + (Math.floor(3 * Math.random()) + 2);

    // set speed for a Enemy within [30, 70)
    this.speed = 2.5 + 3 * (Math.random() - 0.5);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // if the bug crawls out of canvas, innitialize its position and speed again
    if (this.x > COLUMN) {
        Enemy.call(this);
    }
    else {
        this.x += this.speed * dt;
    }

    // check collipse
    // width of the player is 20px(0.24*BLOCK_WIDTH) shorter than BLOCK_WIDTH
    if (Math.abs(this.x - currentPlayer.x) < 1 - 0.24 &&
        Math.abs((this.y - ENEMY_Y_OFFSET) - currentPlayer.y) < 1) {
        // Player.call(Player);
        currentPlayer.x = PLAYER_X;
        currentPlayer.y = PLAYER_Y;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
                  this.x * BLOCK_WIDTH, this.y * BLOCK_HEIGHT);
};

// Now write your own Player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(char) {
    // set sprite for the Player according to its character set
    this.sprite = 'images/char-' + char + '.png';

    // decide if the player should be drawn according to game process
    this.draw = 'false';

    // initialize position of the Player
    this.x = PLAYER_X;
    this.y = PLAYER_Y;

    // move values for updating the position, acquired in .handleInput()
    this.xMove = 0;
    this.yMove = 0;
}

// Update the currentPlayer's position
Player.prototype.update = function() {
    this.x += this.xMove;
    this.y += this.yMove;

    // check if the currentPlayer is now on the other side
    if (this.y == 0) {
        if (currentPlayerNum < 4) {
            // add this player's position to the occupied block array

            // set currentPlayer to be the next player
            currentPlayerNum++;
            currentPlayer = allPlayers[currentPlayerNum];
            currentPlayer.draw = 'true';
        }
    }

    // reset move values
    this.xMove = 0;
    this.yMove = 0;
}

// Draw the player(s) on the screen
Player.prototype.render = function() {
    if (this.draw == 'true') {
        ctx.drawImage(Resources.get(this.sprite),
                      this.x * BLOCK_WIDTH, this.y * BLOCK_HEIGHT);
    }
}

// set move values according to user's keyboard input
// check if the input counts for a move according to currentPlayer's position
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (currentPlayer.x > 0) {
                this.xMove = -1;
            }
            break;
        case 'up':
            if (currentPlayer.y > 0) {
                this.yMove = -1;
            }
            break;
        case 'right':
            if (currentPlayer.x < COLUMN - 1) {
                this.xMove = 1;
            }
            break;
        case 'down':
            if (currentPlayer.y < ROW - 1) {
                this.yMove = 1;
            }
            break;
        default:
            break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// var allEnemies = [new Enemy];
var allEnemies = [new Enemy, new Enemy, new Enemy, new Enemy];

// Place all player object in an array called allPlayers
// Initialize the currentPlayer object to be the first in allPlayers array
var allPlayers = [new Player('boy'), new Player('pink-girl'), new Player('cat-girl'),
                  new Player('horn-girl'), new Player('princess-girl')];
var currentPlayerNum = 0;
var currentPlayer = allPlayers[currentPlayerNum];
currentPlayer.draw = 'true';

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    currentPlayer.handleInput(allowedKeys[e.keyCode]);
});
