//var canvas = $('#game_canvas');

var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;

ctx.beginPath();
ctx.moveTo(25,25);
ctx.lineTo(105,25);
ctx.lineTo(25,105);
ctx.fill();

function update(){
    friction = 0.2;
    gravity = 0.8;

}

player = {
    x: width/2,
    y: height/2,
    vel_x: 0,
    vel_y: 0,
    jumping: false,
}

if (keys[38] || keys[32]) {
    // up arrow or space
    if(!player.jumping){
        player.jumping = true;
        player.vel_y = -player.speed*2;
    }
}

if (keys[39]) {
    // right arrow
    if (player.vel_x < player.speed) {
        player.vel_x++;
    }
}

if (keys[37]) {
    // left arrow
    if (player.vel_x > -player.speed) {
        player.vel_x--;
    }
}
