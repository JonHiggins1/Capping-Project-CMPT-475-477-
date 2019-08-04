console.log('filesearch');
var pgp = require('pg-promise')(/*options*/);

var cn = {
    host: '10.10.7.162', // server name or IP address;
    port: 22,
    database: 'M_Classes',
    user: 'bruce',
    password: 'marist'
};
// alternative:
// var cn = "postgres://username:password@host:port/database";
var client = new pg.client(cn);
client.connect();

var db = pgp(cn); // database instance;


db.query("select * from M_Classes", true)
    .then(function (data) {
        console.log(data); // print data;
    }, function (reason) {
        console.log(reason); // print error;
    });