toggle_speed = 100;

function fade_pulsate(selector){
  for(i=0;i<3;i++){
    $(selector).fadeTo(toggle_speed, 0.5).fadeTo(toggle_speed, 1.0);
  }
}
