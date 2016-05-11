$(document).ready(function() {
  var failed_attempts = 0;

  $("#login-form").submit(function(e){
    $.post("/api/authenticate",
      {
        name: $('#login-name').val(),
        password: $('#login-password').val(),
      },
      function(data, status){
        if(data.success){
          document.cookie = "auth_token="+data.token;
          window.location = $('#redirect-to').text();
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

