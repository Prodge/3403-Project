$(document).ready(function() {
  $("#login-form").submit(function(e){
    $.post("/api/authenticate",
      {
        name: $('#login-name').val(),
        password: $('#login-password').val(),
      },
      function(data, status){
        console.log(data)
        if(data.success){
          document.cookie = "auth_token="+data.token;

          // Toggle visibility of success message
          // toggle visibility of form

        }else{

          // add returned message to error message box
          // toggle visibility of error message

        }
      });
    e.preventDefault();
  });
});

