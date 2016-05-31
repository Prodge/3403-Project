$(document).ready(function() {
  var failed_attempts = 0;

  $("#register-form").submit(function(e){
    $.post("/api/signup",
      {
        name: $('#register-name').val(),
        password: $('#register-password').val(),
        email: $('#register-email').val(),
      },
      function(data, status){
        if(data.success){
          $('#register-form').hide(toggle_speed);
          $('#failure').hide(toggle_speed);
          $('#success').show(toggle_speed);
        }else{
          if(failed_attempts == 0){
            $('#failure-message').html(' ' + data.msg);
            $('#failure').show(toggle_speed);
          }else{
            fade_pulsate('#failure');
          }
          failed_attempts++;
        }
      });
    e.preventDefault();
  });
});
