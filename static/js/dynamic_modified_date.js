$(window).load(function(){
  var today = new Date();
  document.getElementById('Date').innerHTML = today.toDateString();
  var last_mod = new Date(document.lastModified);
  document.getElementById('last-modified').innerHTML += " " + last_mod.toDateString();
});
