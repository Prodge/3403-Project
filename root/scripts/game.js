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

var friction = 0.8;
var gravity = 0.8;
var keys = [];

var platform_height = 20;
var min_platform_width = 50;
var max_platform_width = 250;
var max_platform_height_difference = 100;
var max_platform_y = 100;
var platform_seperation_base_multiplier = 60;

var scroll_speed_multiplier = 5;

var start_time = new Date().getTime();
var elapsed_time = 0;
var last_elapsed_time = 0;

var points = 0;
var points_multiplier = 1;
var points_colour = "white";

var platform_colour = "white";

// Initial platforms
var platforms = [
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


// Key listeners
$(document).keydown(function(e){
    //console.log('keydown', e.keyCode)
    keys[e.keyCode] = true;
})
$(document).keyup(function(e){
    //console.log('keyup', e.keyCode)
    keys[e.keyCode] = false;
})


function run_game(){

    update_elapsed_time();

    update_player_from_input();

    if (on_platform()){
        player.vel_y = 0;
        player.y = on_platform() - player.height;
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


    if (is_player_dead()){
        game_over();
        // Exit the main render loop
        return
    }

    ctx.clearRect(0,0,width,height);

    scroll_world();
    remove_elapsed_platforms();
    buffer_new_platforms();
    render_platforms();

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    update_points();
    render_points();

    requestAnimationFrame(run_game);
}

function buffer_new_platforms(){
    /*
     * Random platform generation based on a set of rules
     */

    function get_rightmost_platform(){
        // Returns the coords of the top right corner of the rightmost platform
        var top_right_corners = platforms.map(function(platform){
            return [platform.x + platform.width, platform.y]
        })
        top_right_corners.sort(function(a, b){
            return b[0] - a[0];
        })
        return top_right_corners[0];
    }

    function is_coord_visible(coord){
        return coord[0] < width && coord[0] > 0;
    }

    function add_new_platform(rightmost_x, rightmost_y){
        // Generates a new platform that the player can jump to given the current rightmost platform

        // The horisontal to the new platform from the last platform
        // Becomes larger with time, as scrolling is faster
        var x_distance = Math.random() * (platform_seperation_base_multiplier * (1 + elapsed_time / 10000));

        // The height difference between the current and the next platform
        var y_difference = Math.random() * max_platform_height_difference;
        // Randomly make negative
        y_difference = y_difference * (Math.round(Math.random()) * 2 - 1);

        var y = rightmost_y + y_difference;
        // Assert 'y' is within canvas
        if(y < max_platform_y){
            y = max_platform_y;
        }
        if(y > height - platform_height){
            y = height - platform_height;
        }

        var width = min_platform_width + (Math.random() * (max_platform_width - min_platform_width));

        platforms.push({
            x: rightmost_x + x_distance,
            y: y,
            width: width,
            height: platform_height,
        })
    }

    var rightmost_platform = get_rightmost_platform();

    if (is_coord_visible(rightmost_platform)){

        add_new_platform(rightmost_platform[0], rightmost_platform[1]);

    }

}

function update_player_from_input(){
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
        player.vel_y++;
    }
}

function keep_player_on_canvas(){
    if (player.x >= width) {
        player.x = width;
    }
    if (player.x <= 0) {
        player.x = 0;
    }
    if (player.y <= 0){
        player.y = 0;
    }

}

function is_player_dead(){
    return player.y >= height;
}


function render_platforms(){
    platforms.map(function(platform){
        ctx.fillStyle = platform_colour;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    })
}

function update_points(){
    var time_difference = elapsed_time - last_elapsed_time;
    points = points + ( (time_difference / 10) * points_multiplier );
    points = parseInt(points);
}

function render_points(){
    ctx.font="20px Lucida Console";
    ctx.fillStyle = points_colour;
    ctx.textAlign="end";
    ctx.fillText(points, width, 30);
}

function update_elapsed_time(){
    var time_now = new Date().getTime();
    last_elapsed_time = elapsed_time;
    elapsed_time = time_now - start_time;
}

function game_over(){
    console.log("game over")
    ctx.fillRect(0, 0, 200, 200);
}

function scroll_world(){
    platforms.map(function(platform){
        platform.x = platform.x - (scroll_speed_multiplier * (elapsed_time / 10000) );
    })
}

function remove_elapsed_platforms(){
    platforms = platforms.filter(function(platform){
        return platform.x + platform.width > 0
    })
}

function get_on_canvas_platforms(){
    return platforms.filter(function(platform){
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
    platforms.some(function(platform){
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
