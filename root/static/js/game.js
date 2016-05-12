/*
 *
 * Action Box
 *
 * A game by Tim Metcalf
 *
 */

// Canvas Props
$(window).load(function(){
  canvas = document.getElementById('game_canvas');
  ctx = canvas.getContext('2d');
  width = canvas.width;
  height = canvas.height;

  high_score = 0;
  get_high_score(function(res){
    high_score = res.highscore;
  })

  character_chosen = 0;
  isPaused = false;

  keys = [];
  last_down_target = null;
  current_screen = "inital_screen";

  character_pos = [25,245,500];
  dangers = [document.getElementById("danger_1"), document.getElementById("danger_2")];

  initialiseCharacterImages();
  initialise();
  draw_initial_screen();

  document.addEventListener("mousedown", function(e){
    last_down_target = e.target
    if (e.target==canvas){
      var mouse_x = e.clientX - canvas.getBoundingClientRect().left;
      var mouse_y = e.clientY - canvas.getBoundingClientRect().top;
      if (current_screen === "inital_screen"){
        if(clickedOn(mouse_x, mouse_y, width/2 - 150, height-height/3.5-20, 300, 60)){
          current_screen = "character_selection";
          draw_character_selection();
        }
      }else if (current_screen === "character_selection"){
        for(var i=0; i<character_pos.length; i++){
          if(clickedOn(mouse_x, mouse_y, character_pos[i], 150, 200, 350)){
            character_chosen = i;
            current_screen = "game";
            start_game();
          }
        }
      }else if (current_screen === "game_over"){
        if(clickedOn(mouse_x, mouse_y, width/2 - 150, height-height/3.5-20, 300, 60)){
          current_screen = "character_selection";
          draw_character_selection();
        }
      }
    }
  });

  document.addEventListener("keydown", function(e){
    if (last_down_target == canvas) keys[e.keyCode] = true;
  });

  document.addEventListener("keyup", function(e){
    if (last_down_target == canvas){
      keys[e.keyCode] = false;
      if (game_running && e.keyCode == 66){
        isPaused = !isPaused;
        if (isPaused){
          render_pause_screen();
        }else{
          pause_end_time = new Date().getTime();
          time_offset += pause_end_time - pause_start_time;
          powerup_started_time += pause_end_time - pause_start_time;
        }
      }
    }
  });

})

function clickedOn(mouse_x, mouse_y, x, y, w, h){
  return mouse_x >= x && mouse_x <= x+w && mouse_y >= y && mouse_y <= y+h;
}

function initialiseCharacterImages(){
  characters = [];
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

$(window).blur(function() {
  if (game_running){
    isPaused = true;
    render_pause_screen();
  }
});

function draw_initial_screen(){
  ctx.fillStyle = text_colour;
  ctx.textAlign="center";

  ctx.font="30px Lucida Console";
  ctx.fillText('Action Box', width/2, height/4);

  ctx.fillStyle = "black";
  ctx.fillRect(width/2 - 150, height-height/3.5-20, 300, 60);
  ctx.fillStyle = "white";
  ctx.fillText('Click here to Play', width/2, height- height/4);
}

function draw_character_selection(){
  ctx.clearRect(0,0,width, height);
  ctx.fillStyle = text_colour;
  ctx.textAlign="center";
  ctx.font="30px Lucida Console";
  ctx.fillText('Please select a character to start', width/2, 60);
  for(var i=0; i<character_pos.length; i++){
    ctx.drawImage(characters[i]["standing"], character_pos[i], 150, 200, 200);
  }
  ctx.fillText('AL', 100, 400);
  ctx.fillText('TIM', 345, 400);
  ctx.fillText('WIMO', 600, 400);
}

function initialise(){
  /*
   * Initialises game variables to global scope
   */
  isPaused = false;

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

  base_gravity = 0.8;
  base_gravity_min = 0.5;
  base_friction = 0.8;
  friction = base_friction;
  gravity = base_gravity;

  platform_height = 30;
  min_platform_width = 75;
  max_platform_width = 200;
  max_platform_height_difference = 100;
  max_platform_y = 200;

  platform_seperation_base_multiplier = 50;
  platform_seperation_update_time = 30000;
  max_platform_seperation = 300;
  current_platform_seperation_level = 0;
  next_platform_seperation_time = platform_seperation_update_time;
  current_min_platform_seperation = 60;
  current_max_platform_seperation = current_min_platform_seperation;

  scroll_speed_base = 2;
  max_scroll_speed = 8
  scroll_speed_update_time = 27500;

  start_time = new Date().getTime();
  elapsed_time = 0;
  last_elapsed_time = 0;

  points = 0;
  base_points_multiplier = 1;
  points_multiplier = base_points_multiplier;

  background_color = "#00CCCC";
  points_colour = "white";
  text_colour = "white";
  platform_colour = "white";
  player_colour = "black";
  danger_2_frame_number = 0;

  game_running = false;
  time_offset = 0;
  pause_start_time = 0;
  pause_end_time = 0;

  min_powerup_time = 3;
  max_powerup_time = 6;
  min_powerup_factor = 1;
  max_powerup_factor = 10;
  powerup_active = false;
  powerup_collected = false;
  powerup_started_time = 0;
  powerup_scroll_speed_incrementer = 0.24;
  powerup_scroll_speed_increment_by = 0.02;
  next_scroll_speed = scroll_speed_base + powerup_scroll_speed_incrementer;

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

function render_pause_screen(){
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0,0,width, height);
  ctx.fillStyle = text_colour;
  ctx.textAlign="center";
  ctx.font="20px Lucida Console";
  ctx.fillText('Press "B" to resume', width/2, height/2);
}

function run_game(){
  if (!isPaused){
    game_loop();
    pause_start_time = new Date().getTime();
  }
  if (game_running){
    myReq = requestAnimationFrame(run_game);
  }
}

function game_loop(){
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

  keep_player_on_canvas();

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

  renderDangers();

}

function renderDangers(){
  ctx.drawImage(dangers[0], 0, 40);
  for(var i=0; i<6; i++){
    ctx.drawImage(dangers[1], danger_2_frame_number*128, 0, 128, 25, i*128, height-25, 128, 25);
  }
  danger_2_frame_number = danger_2_frame_number===8 ? 0 : danger_2_frame_number+1;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render_player(){
  var powerup_tag = powerup_active ? "_powerup" : "";
  if (isPlayerJumping()){
    ctx.drawImage(characters[player.character]["jumping"+powerup_tag], player.x, player.y, player.width, player.height);
  }else if (Math.round(player.vel_x) === 0){
    ctx.drawImage(characters[player.character]["standing"+powerup_tag], player.x, player.y, player.width, player.height);
  }else if (Math.round(player.vel_x) < 0){
    ctx.drawImage(characters[player.character]["running_left"+powerup_tag], player.x, player.y, player.width, player.height);
  }else if (Math.round(player.vel_x) > 0){
    ctx.drawImage(characters[player.character]["running_right"+powerup_tag], player.x, player.y, player.width, player.height);
  }
}

function isPlayerJumping(){
  for(var i=0; i<platforms.length; i++){
    var player_y = player.y + player.height;
    if(
       (player_y === platforms[i].y || player_y === platforms[i].y+gravity) &&
       (Math.floor(player.vel_y) === 0)
    )
    return false;
  }
  return true;
}

function buffer_new_powerups(){
  //A new powerup is generated every current_scroll_speed + powerup_scroll_speed_incrementer
  //where the incrementer gets larger after every powerup generated
  //Therefore, in terms of time starting from 6.4s a powerup is generated and
  //and the next powerup generated will be 0.6s later from the previous powerup
  var current_scroll_speed = scroll_speed_base + elapsed_time/scroll_speed_update_time;
  if (current_scroll_speed > next_scroll_speed){
    var rnd_platform = platforms[platforms.length-1];
    var rnd_type = powerup_types_keys[getRandomInt(0, powerup_types_keys.length-1)];
    powerups.push(
        {
          x: getRandomInt(rnd_platform.x, (rnd_platform.x+rnd_platform.width)-powerup_types[rnd_type].width),
      y: rnd_platform.y - powerup_types[rnd_type].height,
      type: rnd_type,
      time: getRandomInt(min_powerup_time, max_powerup_time),
      factor: Math.random()*(max_powerup_factor-1) + min_powerup_factor
        }
        )
      powerup_scroll_speed_incrementer += powerup_scroll_speed_increment_by;
    next_scroll_speed = current_scroll_speed + powerup_scroll_speed_incrementer;
  }
}

function remove_elapsed_powerups(){
  powerups = powerups.filter(function(powerup){
    return powerup.x > 0;
  });
}

function apply_gravity(factor){
  if(factor){
    var dif = base_gravity - base_gravity_min;
    gravity = base_gravity - ((dif * factor)/10);
  }else{
    gravity = base_gravity;
  }
}

function apply_points_multiplier(factor){
  if(factor){
    points_multiplier = factor;
  }else{
    points_multiplier = base_points_multiplier;
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
  ctx.fillText("Multiplier: " + powerup_active.factor.toFixed(1), width, 120);
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
    //If then the next platform seperation update time is set and the min and max are set
    if(current_max_platform_seperation < max_platform_seperation &&  elapsed_time > next_platform_seperation_time){
      next_platform_seperation_time += platform_seperation_update_time;
      current_min_platform_seperation = current_max_platform_seperation;
      current_max_platform_seperation += platform_seperation_base_multiplier;
      if (current_max_platform_seperation > max_platform_seperation){
        current_max_platform_seperation = max_platform_seperation;
      }
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
  if (player.x >= (width-player.width)) {
    player.x = width-player.width;
  }
  if (player.x <= 0) {
    player.x = 0;
  }
  if (player.y <= 0){
    player.y = 0;
  }

}

function is_player_dead(){
  return player.y >= height || player.x < 10;
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
  elapsed_time = time_now - start_time - time_offset;
}

function get_auth_cookie(){
  cookies = document.cookie.split(';');
  cookie = cookies.filter(function(cookie){
    name = cookie.split('=')[0];
    return name == 'auth_token'
  });
  return cookie[0].split('=')[1];
}

function get_high_score(callback){
  $.ajax({
    url: "/api/get-high-score",
    headers: {"Authorization": get_auth_cookie()},
    success: callback
  });
}

function set_high_score(score){
  $.ajax({
    type: 'POST',
    url: "/api/set-high-score",
    headers: {"Authorization": get_auth_cookie()},
    data: {'highscore': score}
  });
}

function game_over(){
  if(points > high_score){
    high_score = points;
    set_high_score(points);
  }
  game_running = false;

  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = text_colour;
  ctx.textAlign="center";
  ctx.font="20px Lucida Console";
  ctx.fillText('You scored ' + points + " Points!", width/2, height/2);
  ctx.font="17px Lucida Console";
  ctx.fillText('High Score: ' + high_score + " Points", width/2, height/2+30);
  ctx.fillStyle = "black";
  ctx.fillRect(width/2 - 150, height-height/3.5-20, 300, 60);
  ctx.font="30px Lucida Console";
  ctx.fillStyle = "white";
  ctx.fillText('Click here to Restart', width/2, height- height/4);
  current_screen = "game_over";

  cancelAnimationFrame(myReq);
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
