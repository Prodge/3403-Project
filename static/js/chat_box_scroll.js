$(window).load(function(){
  previous_scroll_height = 300;  
  scrollnow();
});

function scrollnow(){
  if($('#chatbox').prop('scrollHeight')>previous_scroll_height){
    $('#chatbox').scrollTop($('#chatbox').prop('scrollHeight'));
    previous_scroll_height = $('#chatbox').prop('scrollHeight');
  }
  window.requestAnimationFrame(scrollnow);
}
