/*
 * This file contains event handlers for navigation element clicks
 * Upon click of a nav button, the content of the page is reloaded
 */

var content = $('#content');
var nav = $('#nav');
var page_folder = 'pages/';


$(nav).click(function(event){
    var button = event.target;
    var page = $(button).attr('content');

    $(content).children().remove();
    $(content).load(page_folder + page);

    // Trigger game function if loading game page
    if(page=="game.html"){
        $(content).trigger("gameLoad");
    }else{
        $(content).trigger("gameClose");
    }
});

console.log('Navigation working');
