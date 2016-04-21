//var canvas = $('#game_canvas');

var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;


var player = {
    x: width/2,
    y: height/2,
    vel_x: 0,
    vel_y: 0,
    //jumping: false,
}
console.log(width, height)

var friction = 0.2;
var gravity = 0.8;
var keys = [];

// Key listeners
document.body.addEventListener("keydown", function(e) {
    console.log("pressed: ", e.keycode);
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

function render(){

    if (keys[38] || keys[32]) {
        // up arrow or space
        if(!player.jumping){
            //player.jumping = true;
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

    player.vel_x *= friction;

    player.vel_y += gravity;

    player.x += player.vel_x;
    player.y += player.vel_y;

    if (player.x >= width) {
        player.x = width-player.width;
    } else if (player.x <= 0) {
        player.x = 0;
    }

    if(player.y >= height){
        player.y = height;
        //player.jumping = false;
    }

    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, 20, 20);
    console.log('working', player)

    requestAnimationFrame(render);

}
render();
