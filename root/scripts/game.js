/*
 *
 * Action Box
 *
 * A game by Tim Metcalf
 *
 */


var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;

var player_standing = document.getElementById("player_standing");
var player_jumping = document.getElementById("player_jumping");
var player_running_left = document.getElementById("player_running_left");
var player_running_right = document.getElementById("player_running_right");
var high_score = 0;

initialise();
draw_initial_screen();

// Key listeners
$(document).keydown(function(e){
    keys[e.keyCode] = true;
})
$(document).keyup(function(e){
    keys[e.keyCode] = false;

    if (! game_running && e.keyCode == 32){
        start_game();
    }
})

function draw_initial_screen(){
    ctx.fillStyle = text_colour;
    ctx.textAlign="center";

    ctx.font="30px Lucida Console";
    ctx.fillText('Action Box', width/2, height/4);

    ctx.font="20px Lucida Console";
    ctx.fillText('Press "Space" to start!', width/2, height/2);
}

function initialise(){
    /*
     * Initialises game variables to global scope
     */
    player = {
        x: width/2,
        y: 32,
        width: 40,
        height: 40,
        vel_x: 0,
        vel_y: 0,
        speed: 20,
    }

    friction = 0.8;
    gravity = 0.8;

    keys = [];

    platform_height = 20;
    min_platform_width = 50;
    max_platform_width = 250;
    max_platform_height_difference = 100;
    max_platform_y = 200;
    platform_seperation_base_multiplier = 100;

    scroll_speed_multiplier = 2;

    start_time = new Date().getTime();
    elapsed_time = 0;
    last_elapsed_time = 0;

    points = 0;
    points_multiplier = 1;

    background_color = "#00CCCC";
    points_colour = "white";
    text_colour = "white";
    platform_colour = "white";
    player_colour = "black";

    game_running = false;

    powerup_chance = 1000;
    max_powerup_time = 10;
    powerup_active = false;
    powerup_started_time = 0;

    powerup_types = {
        gravity:{
            label: "Low Gravity",
            colour: "blue",
            func: apply_gravity,
            width: 30,
            height: 30
        },
        points_multiplier:{
            label: "Points Multiplier",
            colour: "red",
            func: apply_points_multiplier,
            width: 20,
            height: 20
        },
    }

    powerup_types_keys = Object.keys(powerup_types);

    // Initial powerups
    powerups = [
        {
            x: 400,
            y: 50,
            type: 'gravity',
            factor: 5,
            time: 5,
        },
    ]

    // Initial platforms
    platforms = [
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

function start_game(){
    initialise();
    game_running = true;
    run_game();
}

function run_game(){
    /*
     * The main loop for the game
     */

    ctx.fillStyle = background_color;
    ctx.fillRect(0,0,width,height);

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
        return
    }

    scroll_world();
    remove_elapsed_platforms();
    buffer_new_platforms();
    render_platforms();

    scroll_powerups();
    remove_elapsed_powerups();
    buffer_new_powerups();
    if(powerup_active){
        render_powerup_timer();
        check_powerup_expired();
    }else{
        apply_powerup();
        render_powerups();
    }

    render_player();

    update_points();
    render_points();

    requestAnimationFrame(run_game);
}

function render_player(){
    if (Math.floor(player.vel_y) != 0){
        ctx.drawImage(player_jumping, player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) === 0){
        ctx.drawImage(player_standing, player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) < 0){
        ctx.drawImage(player_running_left, player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) > 0){
        ctx.drawImage(player_running_right, player.x, player.y, player.width, player.height);
    }
}

function buffer_new_powerups(){
    // 1 in powerup_chance chance each frame a new powerup is spawned
    var dice_roll = Math.round(Math.random() * powerup_chance);
    if(dice_roll == 1){
        powerups.push(
            {
                x: 300 + Math.random() * width - 350,
                y: -50,
                type: powerup_types_keys[Math.round(Math.random() * (powerup_types_keys.length - 1))],
                time: Math.round(Math.random() * max_powerup_time),
                factor: Math.round(2 + (Math.random() * 10)),
            }
        )
    }
}

function remove_elapsed_powerups(){
    powerups.filter(function(powerup){
        return powerup.y < height;
    })
}

function apply_gravity(factor){
    if(factor){
        gravity = factor/10;
    }else{
        gravity = 0.8;
    }
}

function apply_points_multiplier(factor){
    if(factor){
        points_multiplier = factor;
    }else{
        points_multiplier = 1;
    }

}

function get_colliding_powerup(){
    var colliding_powerups = powerups.filter(function(powerup){
        if(
            player.x + player.width/2 > powerup.x &&
            player.x + player.width/2 < powerup.x + powerup_types[powerup.type].width &&
            player.y + player.height/2 > powerup.y &&
            player.y + player.height/2 < powerup.y + powerup_types[powerup.type].height
        ){
            return true;
        }else{
            return false;
        }
    })
    if (colliding_powerups.length == 0){
        return false;
    }else{
        return colliding_powerups[0];
    }

}

function check_powerup_expired(){
    var current_time = new Date().getTime();
    if(powerup_started_time + powerup_active.time * 1000 < current_time){
        powerup_types[powerup_active.type].func();
        powerup_active = false;
    }

}

function render_powerup_timer(){
    var current_time = new Date().getTime();
    var time = Math.round( (powerup_started_time + (powerup_active.time*1000) - current_time) /1000 );

    ctx.font="20px Lucida Console";
    ctx.fillStyle = points_colour;
    ctx.textAlign="end";
    ctx.fillText("Powerup Active: " + powerup_types[powerup_active.type].label, width, 60);
    ctx.fillText("Multiplier: " + powerup_active.factor, width, 90);
    ctx.fillText("Time Left: " + time, width, 120);
}

function apply_powerup(){
    var powerup = get_colliding_powerup();
    if(! powerup){
        return
    }
    powerup_active = powerup;
    powerup_started_time = new Date().getTime();

    // Call powerup type function with factor to apply the powerup
    powerup_types[powerup.type].func(powerup.factor);
}

function scroll_powerups(){
    powerups = powerups.map(function(powerup){
        powerup.y = powerup.y + 0.5;
        return powerup;
    })
}

function render_powerups(){
    powerups.map(function(powerup){
        ctx.fillStyle = powerup_types[powerup.type].colour;
        ctx.fillRect(
            powerup.x,
            powerup.y,
            powerup_types[powerup.type].width,
            powerup_types[powerup.type].height
        );
    })
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

function reset_start_time(){
    start_time = new Date().getTime()
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
    ctx.textAlign="start";
    ctx.fillText("High Score: " + high_score, 0, 30);
    ctx.textAlign="end";
    ctx.fillText("Current Score: " + points, width, 30);
}

function update_elapsed_time(){
    var time_now = new Date().getTime();
    last_elapsed_time = elapsed_time;
    elapsed_time = time_now - start_time;
}

function game_over(){
    game_running = false;

    ctx.clearRect(0,0,width,height);

    ctx.fillStyle = text_colour;
    ctx.textAlign="center";

    ctx.font="20px Lucida Console";
    ctx.fillText('You scored ' + points + " Points!", width/2, height/2);

    ctx.font="15px Lucida Console";
    ctx.fillText('Press "Space" to try again!', width/2, height - height/4);

    high_score = points;
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
