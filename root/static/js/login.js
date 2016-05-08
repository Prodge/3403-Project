$(document).ready(function() {
  $("#login-form").submit(function(e){
    $.post("/api/authenticate",
      {
        name: $('#login-name').val(),
        password: $('#login-password').val(),
      },
      function(data, status){
        if(data.success){
          document.cookie = "auth_token="+data.token;
          window.location = "/play";
        }else{
          console.log(data.msg)
          $('#failure-message').html(' ' + data.msg);
          $('#failure').show(100);
        }
      });
    e.preventDefault();
  });
});

