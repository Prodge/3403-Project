$(document).ready(function() {
  var failed_attempts = 0;

  function get_auth_cookie(){
    cookies = document.cookie.split(';');
    cookie = cookies.filter(function(cookie){
      name = cookie.split('=')[0];
      return name == 'auth_token'
    });
    return cookie[0].split('=')[1];
  }

  $("#validate-user").submit(function(e){
    $.ajax({
      type: 'POST',
      url: "/api/validate-user",
      headers: {"Authorization": get_auth_cookie()},
      data: {
        'current_password': $('#current_password').val(),
      },
      success: function(data){
        if(data.success){
          $('#validate-user').hide(toggle_speed);
          $('#profile-update-form').show(toggle_speed);
          $('#failure').hide(toggle_speed);
        }else{
          $('#failure-message').html(' ' + data.msg);
          if(failed_attempts == 0){
            $('#failure').show(toggle_speed);
          }else{
            fade_pulsate('#failure');
          }
          failed_attempts++;
        }
      }
    });
    e.preventDefault();
  });

  $("#profile-update-form").submit(function(e){
    $.ajax({
      type: 'POST',
      url: "/api/profile-update",
      headers: {"Authorization": get_auth_cookie()},
      data: {
        'password': $('#profile-password').val(),
        'email': $('#profile-email').val(),
      },
      success: function(data){
        if(data.success){
          $('#profile-update-form').hide(toggle_speed);
          $('#failure').hide(toggle_speed);
          $('#success').show(toggle_speed);
        }else{
          $('#failure-message').html(' ' + data.msg);
          if(failed_attempts == 0){
            $('#failure').show(toggle_speed);
          }else{
            fade_pulsate('#failure');
          }
          failed_attempts++;
        }
      }
    });
    e.preventDefault();
  });
});
