/*
 * This file loads static page elements from external files
 */

var page_elements_dir = "page_elements/";

$("#nav").load(page_elements_dir + "nav.html");
$("#footer").load(page_elements_dir + "footer.html");

console.log($('#nav'));
