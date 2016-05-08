$(document).ready(function() {
  $("#register-form").submit(function(e){
    $.post("/api/signup",
      {
        name: $('#register-name').val(),
        password: $('#register-password').val(),
      },
      function(data, status){
        console.log(data)
        if(data.success){
          $('#register-form').hide(100);
          $('#failure').hide(100);
          $('#success').show(100);
        }else{
          $('#failure-message').innerHTML = data.msg;
          $('#failure').show(100);
        }
      });
    e.preventDefault();
  });
});
