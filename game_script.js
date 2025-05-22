const arena_size = 500; //size of the arena (make it equal to canvas size from the HTML)
const player_size = 20; //size of the player (height and width)
let time_left = 60; //Total time duration of each game

const target_hit_score = 30; //Score when hit a target (this gets added)
const damage_score = 10; //Score when got hit by the bullet (this gets subtracted)
const shoot_score = 1; //Score deducted for each bullet used

//All properties of player 1
const player1 = {
    color: "#39FF14",
    bullet_time_period: 30, //time taken (in ms) by bullet to travel a unit
    score: 0,
    X: 0, //X-coordinate of the player 1
    Y: arena_size / 2, //Y-coordinate of the player 1
    bullet_color: "#FFD700",
};

//All properties of player 2
const player2 = {
    color: "#31A2FF",
    bullet_time_period: 30,
    score: 0,
    X: arena_size - player_size,
    Y: arena_size / 2,
    bullet_color: "#FF00FF",
};

//General
const time_left_elem = document.getElementById("timeLeft");
const canvas = document.getElementById("gameArea");
const bgctx = canvas.getContext("2d");
const canvasColor = "#111111"; //Colour of the canvas (arena)
const ammoPadColor = "#1b1b1b"

//For Player 1
const ctx1 = document.getElementById("player1").getContext("2d");
const player1_score_element = document.getElementById("player1_score");
const player1_bullet_speed_element = document.getElementById("player1_bullet_speed");

//For Player 2
const ctx2 = document.getElementById("player2").getContext("2d");
const player2_score_element = document.getElementById("player2_score");
const player2_bullet_speed_element = document.getElementById("player2_bullet_speed");

//creates the arena at the start of the game
function startNewGame(d = arena_size) {
    if (!canvas.getContext) {
        alert("Canvas not supported in your browser!");
        return;
    }


    bgctx.strokeStyle = "white";
    //To draw the canvas box
    bgctx.fillStyle = canvasColor;
    bgctx.beginPath();
    bgctx.moveTo(0, 0);
    bgctx.lineTo(d, 0);
    bgctx.lineTo(d, d);
    bgctx.lineTo(0, d);
    bgctx.lineTo(0, 0);
    bgctx.fill();
    bgctx.stroke();

    bgctx.fillStyle = ammoPadColor;
    bgctx.beginPath();
    bgctx.moveTo(d / 3, d / 3);
    bgctx.lineTo(2 * d / 3, d / 3);
    bgctx.lineTo(2 * d / 3, 2 * d / 3);
    bgctx.lineTo(d / 3, 2 * d / 3);
    bgctx.lineTo(d / 3, d / 3);
    bgctx.fill();


    //To draw the boundary at the middle
    bgctx.strokeStyle = "white"
    bgctx.beginPath();
    bgctx.moveTo(d / 2, 0);
    bgctx.lineTo(d / 2, d);
    bgctx.stroke();


    time_left_elem.innerText = time_left;

    //Add initial player details on the page
    player1_score_element.innerText = player1.score;
    player1_bullet_speed_element.innerText = Number(1000 / player1.bullet_time_period).toFixed(2)
    ctx1.fillStyle = player1.color;
    ctx1.fillRect(0, d / 2, player_size, player_size);

    player2_score_element.innerText = player2.score;
    player2_bullet_speed_element.innerText = Number(1000 / player2.bullet_time_period).toFixed(2)
    ctx2.fillStyle = player2.color;
    ctx2.fillRect(d - player_size, d / 2, player_size, player_size);
}

//Used to redraw the bgctx (background canvas)
function redraw_arena(d = arena_size) {
    bgctx.clearRect(0, 0, d, d);

    bgctx.strokeStyle = "white";

    bgctx.fillStyle = canvasColor;
    bgctx.beginPath(); //starts a new shape path
    bgctx.moveTo(0, 0); //goes to an initial point
    bgctx.lineTo(d, 0); //moves to another point for line
    bgctx.lineTo(d, d);
    bgctx.lineTo(0, d);
    bgctx.lineTo(0, 0);
    bgctx.fill();
    bgctx.stroke();

    bgctx.fillStyle = ammoPadColor;
    bgctx.beginPath();
    bgctx.moveTo(d / 3, d / 3);
    bgctx.lineTo(2 * d / 3, d / 3);
    bgctx.lineTo(2 * d / 3, 2 * d / 3);
    bgctx.lineTo(d / 3, 2 * d / 3);
    bgctx.lineTo(d / 3, d / 3);
    bgctx.fill();

    bgctx.beginPath();
    bgctx.moveTo(d / 2, 0);
    bgctx.lineTo(d / 2, d);
    bgctx.stroke();
}

//Logic for player 1 shooting bullet
function shoot1(p, q) {
    player1.score -= shoot_score; //removes a score for shooting bullet
    player1_score_element.innerText = player1.score;

    //enables the bullet to keep moving continuosly
    const gun_shoot = setInterval(() => {
        p += player_size / 2.5;
        ctx1.clearRect(
            p - player_size / 2.5,
            q,
            player_size / 2.5,
            player_size / 2.5
        );
        ctx1.fillStyle = player1.bullet_color;
        ctx1.fillRect(p, q, player_size / 2.5, player_size / 2.5);

        //This checks if the bullet hit the target
        if (hit_detection(p, q, 1)) {
            player1.score += target_hit_score;
            player1_score_element.innerText = player1.score;
            //update the bullet speeds
            player1_bullet_speed_element.innerText = Number(1000 / player1.bullet_time_period).toFixed(2)
            player2_bullet_speed_element.innerText = Number(1000 / player2.bullet_time_period).toFixed(2)
            player2.score -= damage_score;
            if (player1.bullet_time_period < 40) player1.bullet_time_period += 0.5;
            if (player2.bullet_time_period > 20) player2.bullet_time_period -= 0.5; //if player1 hits player2 then bullet speed of player2 increases. This is done, for fair play.
            player2_score_element.innerText = player2.score;
            ctx1.clearRect(p, q, player_size / 2.5, player_size / 2.5); //removes the bullet, once hit the target
            add_blood(player2.X, player2.Y); //add blood effect to player 2
            clearInterval(gun_shoot); //removes the bullet animation (since already hit)
            return;
        }

        //Checks if bullet left the arena (boundary)
        if (p >= arena_size) {
            clearInterval(gun_shoot);
        }
    }, player1.bullet_time_period);
}

//Logic for player 2 shooting bullet
function shoot2(p, q) {
    player2.score -= shoot_score;
    player2_score_element.innerText = player2.score;
    const gun_shoot2 = setInterval(() => {
        p -= player_size / 2.5;
        ctx2.clearRect(
            p + player_size / 2.5,
            q,
            player_size / 2.5,
            player_size / 2.5
        );
        ctx2.fillStyle = player2.bullet_color;
        ctx2.fillRect(p, q, player_size / 2.5, player_size / 2.5);

        if (hit_detection(p, q, 2)) {
            player2.score += target_hit_score;
            player2_score_element.innerText = player2.score;
            //update the bullet speeds
            player1_bullet_speed_element.innerText = Number(1000 / player1.bullet_time_period).toFixed(2)
            player2_bullet_speed_element.innerText = Number(1000 / player2.bullet_time_period).toFixed(2)
            player1.score -= damage_score;
            if (player2.bullet_time_period < 40) player2.bullet_time_period += 0.5;
            if (player1.bullet_time_period > 20) player1.bullet_time_period -= 0.5;
            player1_score_element.innerText = player1.score;
            ctx2.clearRect(p, q, player_size / 2.5, player_size / 2.5);

            add_blood(player1.X, player1.Y);
            clearInterval(gun_shoot2);
            return;
        }

        if (p < -player_size / 2.5) {
            clearInterval(gun_shoot2);
        }
    }, player2.bullet_time_period);
}

//To move a unit distance in the positive x direction (right)
//t is to track the player. If t = 1, then player 1 need to move ton right else player 2
function move_xP(t) {
    if (t == 1 && player1.X + player_size <= arena_size / 2 - player_size) {
        player1.X += player_size; // Update position first
        ctx1.clearRect(
            player1.X - player_size,
            player1.Y,
            player_size,
            player_size
        );
        ctx1.fillStyle = player1.color;
        ctx1.fillRect(player1.X, player1.Y, player_size, player_size);
    } else if (t == 2 && player2.X + player_size <= arena_size - player_size) {
        player2.X += player_size;
        ctx2.clearRect(
            player2.X - player_size,
            player2.Y,
            player_size,
            player_size
        );
        ctx2.fillStyle = player2.color;
        ctx2.fillRect(player2.X, player2.Y, player_size, player_size);
    }
}

function move_xN(t) {
    if (t == 1 && player1.X - player_size >= 0) {
        player1.X -= player_size;
        ctx1.clearRect(
            player1.X + player_size,
            player1.Y,
            player_size,
            player_size
        );
        ctx1.fillStyle = player1.color;
        ctx1.fillRect(player1.X, player1.Y, player_size, player_size);
    } else if (t == 2 && player2.X >= arena_size / 2 + player_size) {
        player2.X -= player_size;
        ctx2.clearRect(
            player2.X + player_size,
            player2.Y,
            player_size,
            player_size
        );
        ctx2.fillStyle = player2.color;
        ctx2.fillRect(player2.X, player2.Y, player_size, player_size);
    }
}

function move_yP(t) {
    if (t == 1 && player1.Y - player_size >= 0) {
        player1.Y -= player_size;
        ctx1.clearRect(
            player1.X,
            player1.Y + player_size,
            player_size,
            player_size
        );
        ctx1.fillStyle = player1.color;
        ctx1.fillRect(player1.X, player1.Y, player_size, player_size);
    } else if (t == 2 && player2.Y - player_size >= 0) {
        player2.Y -= player_size;
        ctx2.clearRect(
            player2.X,
            player2.Y + player_size,
            player_size,
            player_size
        );
        ctx2.fillStyle = player2.color;
        ctx2.fillRect(player2.X, player2.Y, player_size, player_size);
    }
}

function move_yN(t) {
    if (t == 1 && player1.Y + player_size <= arena_size - player_size) {
        player1.Y += player_size;
        ctx1.clearRect(
            player1.X,
            player1.Y - player_size,
            player_size,
            player_size
        );
        ctx1.fillStyle = player1.color;
        ctx1.fillRect(player1.X, player1.Y, player_size, player_size);
    } else if (t == 2 && player2.Y + player_size <= arena_size - player_size) {
        player2.Y += player_size;
        ctx2.clearRect(
            player2.X,
            player2.Y - player_size,
            player_size,
            player_size
        );
        ctx2.fillStyle = player2.color;
        ctx2.fillRect(player2.X, player2.Y, player_size, player_size);
    }
}

//Used to detect if the bullet actually hit other player. Taken care by approximations
function hit_detection(p, q, player_number) {
    if (
        player_number == 1 &&
        Math.abs(p - player2.X) <= 8 &&
        Math.abs(player2.Y - q) <= 8
    ) {

        return true;
    } else if (
        player_number == 2 &&
        Math.abs(p - player1.X) <= 8 &&
        Math.abs(player1.Y - q) <= 8
    )
        return true;
}

//Adds the blood effect around the target that got hit
function add_blood(x, y, d = player_size) {
    //(x, y) -> Player's coordinate

    //Adds the blood around the player
    bgctx.beginPath();
    bgctx.arc(x + d / 2, y + d / 2, d, 0, 2 * Math.PI);
    bgctx.fillStyle = "#FF3131";
    bgctx.fill();

    //Removes the blood after few ms
    setTimeout(() => {
        redraw_arena();
    }, 50);
}

//Adding controls to the game
window.addEventListener("keyup", (e) => {
    e.preventDefault();

    switch (e.code) {
        case "ArrowLeft":
            move_xN(2)
            break;

        case "ArrowRight":
            move_xP(2)
            break;

        case "ArrowUp":
            move_yP(2)
            break;

        case "ArrowDown":
            move_yN(2)
            break;

        case "KeyA":
            move_xN(1)
            break;

        case "KeyD":
            move_xP(1)
            break;

        case "KeyW":
            move_yP(1)
            break;

        case "KeyS":

            move_yN(1)
            break;

        //for shooting by player 1
        case "KeyE":
            shoot1(player1.X + player_size, player1.Y + player_size / 2.5);
            break;
//! will change
        case "Slash":
            shoot2(player2.X - player_size, player2.Y + player_size / 2.5);
            break;
    }
});

//Keeps track of the timer and alerts after timer hits 0
const check_winner = setInterval(() => {
    time_left--;
    time_left_elem.innerText = time_left;
    if (time_left == -1) {
        clearInterval(check_winner);
        if (player1.score > player2.score) {
            time_left_elem.innerHTML =
                'Player 1 won! <a href = "game.html" style = "color : red">Play again!</a>';
        } else if (player1.score < player2.score) {
            alert("Player 2 won!");
            time_left_elem.innerHTML =
                'Player 2 won! <a href = "game.html" style = "color : red">Play again!</a>';
        } else {
            alert("Draw!");
            time_left_elem.innerHTML =
                'Draw! <a href = "game.html" style = "color : red">Play again!</a>';
        }
    }
}, 1000);

startNewGame();
