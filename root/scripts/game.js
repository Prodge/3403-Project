//var canvas = $('#game_canvas');

var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;


var player = {
    x: width/2,
    y: 32,
    width: 20,
    height: 20,
    vel_x: 0,
    vel_y: 0,
    speed: 20,
}
console.log(width, height)

var friction = 0.8;
var gravity = 0.8;
var keys = [];

var platform_height = 10

// Key listeners
$(document).keydown(function(e){
    //console.log('keydown', e.keyCode)
    keys[e.keyCode] = true;
})
$(document).keyup(function(e){
    //console.log('keyup', e.keyCode)
    keys[e.keyCode] = false;
})

// Levels
var levels= {
    1: [
        {
            x: 100,
            y: 100,
            width: 400,
            height: platform_height,
        },
        {
            x: 300,
            y: 400,
            width: 200,
            height: platform_height,
        },
        {
            x: 600,
            y: 300,
            width: 200,
            height: platform_height,
        },
        {
            x: 900,
            y: 200,
            width: 200,
            height: platform_height,
        },
    ]
}

var level = 1;


function render(){


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

    if (keys[40]) {
        // down arrow
        player.vel_y = +player.speed;
    }


    if (on_platform()){
        player.vel_y = 0;
        // note could remove this duplicate call
        player.y = on_platform() - player.height;// - 1

        if (keys[38] || keys[0]) {
            // up arrow or space
            player.vel_y = - 15;
        }
    }else{
        player.vel_y += gravity;
    }
    player.vel_x *= friction;

    player.x += player.vel_x;
    player.y += player.vel_y;

    if (player.x >= width) {
        player.x = width;
    }
    if (player.x <= 0) {
        player.x = 0;
    }
    if (player.y <= 0){
        player.y = 0;
    }
    if (player.y >= height){
        game_over();
        return
    }

    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    //console.log('working', player)

    levels[level].map(function(platform){
        ctx.fillStyle = "white";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    })

    scroll_world();

    if(get_on_canvas_platforms().length == 0){
        console.log("completed level")
    }

    requestAnimationFrame(render);
}

function game_over(){
    console.log("game over")
    ctx.fillRect(0, 0, 200, 200);
}

function scroll_world(){
    levels[level].map(function(platform){
        platform.x = platform.x - 5;
    })
}

function get_on_canvas_platforms(){
    return levels[level].filter(function(platform){
        if(
            platform.x + platform.width > 0 &&
            platform.x < width
        ){
            return true;
        }else{
            return false;
        }
    })
}

function on_platform(){
    var platform_heights = get_on_canvas_platforms().map(function(platform){
        //console.log(platform)
        if(
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ){
            return platform.y;
        }
        return false;
    })

    // platform heights is a list of false / top height of platforms that the player is on
    // There should only be one number, but just in case the lowest is returned
    platform_heights = platform_heights.filter(function(e){
        return (typeof(e) != "boolean")
    })

    if(platform_heights.length >= 1){
        return Math.min.apply(Math, platform_heights);
    }else{
        return false;
    }
}


function detect_colission(){
    /*
     * Returns true if there is a collision between the player and any of the platforms
     */

    //function isIntersecting(p1, p2, p3, p4) {
        //function CCW(p1, p2, p3) {
                //return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
            //}
        //return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
    //}

    function intersects(a,b,c,d,p,q,r,s) {
      var det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    };


    function get_line_segments(x, y, width, height){
        // returns a list of lines defined by the list (x1, y1, x2, y2)
        var lines = [];
        lines.push([
            x - width/2,
            y + height/2,
            x + width/2,
            y + height/2,
        ]);
        // bottom line
        lines.push([
            x - width/2,
            y - height/2,
            x + width/2,
            y - height/2,
        ]);
        // Left line
        lines.push([
            x - width/2,
            y + height/2,
            x - width/2,
            y - height/2,
        ]);
        // Right line
        lines.push([
            x + width/2,
            y + height/2,
            x + width/2,
            y - height/2,
        ]);
        return lines
    }

    var platform_line_segments = [];
    // Build a list of all platform line segments
    levels[level].some(function(platform){
        platform_line_segments.concat(
            get_line_segments(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            )
        )
    })

    var player_line_segments = get_line_segments(
        player.x,
        player.y,
        player.width,
        player.height
    )

    // Check player line segments with each platform line segment
    return player_line_segments.some(function(player_line){
        return platform_line_segments.some(function(platform_line){
            console.log('here')
            console.log(player_line);
            return intersects(
                player_line[0],
                player_line[1],
                player_line[2],
                player_line[3],
                platform_line[0],
                platform_line[1],
                platform_line[2],
                platform_line[3]
            )
        })
    })
}

render();
