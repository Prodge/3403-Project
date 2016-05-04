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

var characters = [];

function initialiseCharacterImages(){
    var character_names = ["al", "tim", "wimo"];
    var movements = ["standing", "jumping", "running_left", "running_right"];
    for (var i=0; i<character_names.length; i++){
        var dict = {};
        for (var j=0; j<movements.length; j++){
            dict[movements[j]] = document.getElementById(character_names[i] + "_" + movements[j]);
            dict[movements[j]+"_powerup"] = document.getElementById(character_names[i] + "_" + movements[j] + "_powerup");
        }
        characters.push(dict);
    }
}

var high_score = 0;
var character_chosen = 0;

initialiseCharacterImages();
initialise();
draw_initial_screen();

// Key listeners
$(document).keydown(function(e){
    keys[e.keyCode] = true;
})
$(document).keyup(function(e){
    keys[e.keyCode] = false;
    var key_to_character = { 49:0, 50:1, 51:2 };
    if (! game_running && (e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51)){
        character_chosen = key_to_character[e.keyCode];
        start_game();
    }
})

function draw_initial_screen(){
    ctx.fillStyle = text_colour;
    ctx.textAlign="center";

    ctx.font="30px Lucida Console";
    ctx.fillText('Action Box', width/2, height/4);

    ctx.font="20px Lucida Console";
    ctx.fillText('Press "1" to start with character AL!', width/2, height/2);
    ctx.fillText('Press "2" to start with character TIM!', width/2, height/2+30);
    ctx.fillText('Press "3" to start with character WIMO!', width/2, height/2+60);
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
        character: character_chosen
    }

    friction = 0.8;
    gravity = 0.8;

    keys = [];

    platform_height = 20;
    min_platform_width = 75;
    max_platform_width = 200;
    max_platform_height_difference = 100;
    max_platform_y = 200;

    platform_seperation_base_multiplier = 50;
    max_platform_seperation = 300;
    current_platform_seperation_level = 0;
    current_min_platform_seperation = 50;
    current_max_platform_seperation = current_min_platform_seperation;
    platform_seperation_update_time = 30000;

    scroll_speed_base = 2;
    max_scroll_speed = 8
    scroll_speed_update_time = 27500;

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

    max_powerup_time = 6;
    powerup_active = false;
    powerup_started_time = 0;
    previous_scroll_speed = scroll_speed_base;
    next_powerup_in = 0.24;
    powerup_collected = false;

    powerup_types = {
        gravity:{
            label: "Low Gravity",
            colour: "blue",
            func: apply_gravity,
            width: 20,
            height: 20
        },
        points_multiplier:{
            label: "Points Multiplier",
            colour: "red",
            func: apply_points_multiplier,
            width: 20,
            height: 20
        },
        random:{
            label: "Mystery powerup",
            colour: "black",
            func: apply_random,
            width: 20,
            height: 20
        }
    }

    powerup_types_keys = Object.keys(powerup_types);

    // Initial powerups
    powerups = [
        {
            x: 200,
            y: 70,
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

    ctx.clearRect(0,0,width, height);
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

    remove_elapsed_powerups();
    buffer_new_powerups();
    apply_powerup();
    render_powerups();
    if(powerup_active){
        render_powerup_timer();
        check_powerup_expired();
    }

    render_player();

    update_points();
    render_points();

    requestAnimationFrame(run_game);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render_player(){
    var powerup_tag = "";
    if (powerup_active){
        powerup_tag = "_powerup";
    }
    if (Math.floor(player.vel_y) != 0){
        ctx.drawImage(characters[player.character]["jumping"+powerup_tag], player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) === 0){
        ctx.drawImage(characters[player.character]["standing"+powerup_tag], player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) < 0){
        ctx.drawImage(characters[player.character]["running_left"+powerup_tag], player.x, player.y, player.width, player.height);
    }else if (Math.round(player.vel_x) > 0){
        ctx.drawImage(characters[player.character]["running_right"+powerup_tag], player.x, player.y, player.width, player.height);
    }
}

function buffer_new_powerups(){
    //from every 6.4 secs a powerup is generated and 
    //the next powerup generated will be 0.6sec later of the previous powerup
    var current_scroll_speed = scroll_speed_base + elapsed_time/scroll_speed_update_time;
    if ((previous_scroll_speed+next_powerup_in)<current_scroll_speed){
        var rnd_platform = platforms[platforms.length-1];
        var rnd_type = powerup_types_keys[getRandomInt(0, powerup_types_keys.length-1)];
        powerups.push(
            {
                x: getRandomInt(rnd_platform.x, (rnd_platform.x+rnd_platform.width)-powerup_types[rnd_type].width),
                y: rnd_platform.y - powerup_types[rnd_type].height,
                type: rnd_type,
                time: getRandomInt(3, max_powerup_time),
                factor: Math.random()*9+1 
            }
        )
        next_powerup_in += 0.02;
        previous_scroll_speed = current_scroll_speed;
    }
}

function remove_elapsed_powerups(){
    powerups = powerups.filter(function(powerup){
        return powerup.x > 0;
    });
}

function apply_gravity(factor){
    if(factor){
        var dif = 0.8 - 0.5;
        gravity = 0.8 - ((dif * factor)/10);
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

function apply_random(factor){
    //factor is rounded an reduced by 1 to confirm with array
    //if not in array then generate a random number in the array
    //excluding the last element because it's the random one
    if ((Math.round(factor)-1) < (powerup_types_keys.length-1)){
        powerup_active.type = powerup_types_keys[Math.round(factor)-1];
    }else{
        powerup_active.type = powerup_types_keys[getRandomInt(0, powerup_types_keys.length-2)];
    }
    powerup_types[powerup_active.type].func(powerup_active.factor);
}

function get_colliding_powerup(){
    for (var i=0; i<powerups.length; i++){
        powerup = powerups[i];
        if(
            player.x + player.width/2 > powerup.x &&
            player.x + player.width/2 < powerup.x + powerup_types[powerup.type].width &&
            player.y + player.height/2 > powerup.y &&
            player.y + player.height/2 < powerup.y + powerup_types[powerup.type].height
        ){
            //every powerup collected replaces the previous powerup
            powerup_collected = powerups[i];
            powerups.splice(powerups[i],1);
            return true;
        }
    }
    return false;
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
    ctx.fillText("Powerup Active: " + powerup_types[powerup_active.type].label, width, 90);
    ctx.fillText("Multiplier: " + powerup_active.factor, width, 120);
    ctx.fillText("Time Left: " + time, width, 150);
}

function apply_powerup(){
    if(!get_colliding_powerup() && !powerup_collected){
        return
    }
    //if powerup collected is activated then
    if (keys[65]){
        powerup_active = powerup_collected;
        powerup_started_time = new Date().getTime();

        // Call powerup type function with factor to apply the powerup
        powerup_types[powerup.type].func(powerup_active.factor);
        powerup_collected = false;
    }
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
        ctx.fillStyle = "white";
        ctx.textAlign="center";
        ctx.font="11px Lucida Console";
        ctx.fillText(
            powerup.factor.toFixed(1),
            powerup.x+(powerup_types[powerup.type].width/2),
            powerup.y+(powerup_types[powerup.type].height/2)
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

        //Checks whether the current max seperation has not reached the maximum
        //and whether 30s has elapsed to increase the seperation limits
        //If then a new seperation level is set and the min and max are set
        if( 
            current_max_platform_seperation < max_platform_seperation && 
            Math.floor(elapsed_time/platform_seperation_update_time) > current_platform_seperation_level
        ){
            current_platform_seperation_level = Math.floor(elapsed_time/platform_seperation_update_time);
            current_min_platform_seperation = current_max_platform_seperation;
            current_max_platform_seperation = (current_platform_seperation_level+1) * platform_seperation_base_multiplier;
        }        
        x_distance = getRandomInt(current_min_platform_seperation, current_max_platform_seperation);

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
    if (!powerup_collected){
        ctx.fillText("Powerup Collected: None", width, 60);
    }else{
        ctx.fillText("Powerup Collected: " + powerup_types[powerup_collected.type].label, width, 60);
    }
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
    ctx.fillText('Press "1" to start with character AL!', width/2, height - height/4);
    ctx.fillText('Press "2" to start with character TIM!', width/2, height - height/4+20);
    ctx.fillText('Press "3" to start with character WIMO!', width/2, height - height/4+40);

    high_score = points;
}

function scroll_world(){
    var current_speed =  scroll_speed_base + elapsed_time/scroll_speed_update_time;
    if (current_speed > max_scroll_speed){
        current_speed = max_scroll_speed;
    }
    platforms.map(function(platform){
        platform.x = platform.x - current_speed;
    })
    powerups.map(function(powerup){
        powerup.x = powerup.x - current_speed;
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
