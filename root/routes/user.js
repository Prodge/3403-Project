
/*
 * GET users listing.
 */

exports.list = function(req, res){
  console.log(req);
  res.send('request is: ', req, "respond with a resource");
};
