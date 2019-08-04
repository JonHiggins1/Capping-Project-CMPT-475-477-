var app = require('../index');
var pg = require('../lib/postgres');

var DATABASE_URL = 'postgres://bruce:marist@localhost/Database.sql'

// Connect to mysql database
pg.initialize(DATABASE_URL, function(err) {
  if (err) {
    throw err;
  }

  // Which port to listen on
  app.set('port', process.env.PORT || 22);

  // Start listening for HTTP requests
  var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
});