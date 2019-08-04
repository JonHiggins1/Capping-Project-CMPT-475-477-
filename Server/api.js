//Declare variables
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util')
var static = require('node-static');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var path = require('path');
var app = express();
var mssql = require('mssql'); 
var pg = require('pg');

//Global sql and connection variables
var sql = require('node-sqlserver');

//Connect to database 
var conn_str = "Driver={SQL Server Native Client 11.0};Server=(local);Database=transfercredits;Trusted_Connection={Yes}";

//SOMEONE FIGURE OUT WHAT THIS DOES --------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'10mb', extended: true}));
app.use(bodyParser.json({limit:'10mb'})); 
var fs = require("fs");
url = require('url');
//------------------------------------------------------------

//Admin login ----------------------------------------------------------------------------------------------------------------------------------------------
app.post('/api/Adminlogin',function(req,res,next){
   
   console.log("login");
    res.contentType('application/json');

    if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')){
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }

    sql.open(conn_str, function (err, conn) {
        if (err) {
                res.statusCode = 500;
                console.log("Error opening the connection!");
                return res.send('Error opening the connection!');
        }
        conn.query("SELECT * FROM transfercredits.dbo.Users WHERE UserName Like '"+req.body.username+"' and Password Like '"+req.body.password+"'", function (err, results) {
        if (err) {
                    res.statusCode = 500;
                    console.log("Error running query!");
                    return res.send('Internal Error');
        }
        else {
          if(results.length === 0){
                    res.statusCode = 404;
                    return res.send('Incorrect Username or Password');
                }else{
            
                console.log(results);
                res.send(results);  
                next();
                }
            }

        });
    });

});
//----------------------------------------------------------------------------------------------------------------------------------------------

//Create Prospective student login
app.get('/api/ProspectiveStudentlogin',function(req,res,next){
   
   console.log("Create");
    res.contentType('application/json');

    if(!req.body.hasOwnProperty('First Name') || !req.body.hasOwnProperty('Last Name')){
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }
    if (!req.body.hasOwnProperty('E-Mail')){
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }

    sql.open(conn_str, function (err, conn) {
        if (err) {
                res.statusCode = 500;
                console.log("Error opening the connection!");
                return res.send('Error opening the connection!');
        }
        
        //Add the student into the peoples table
        conn.query("INSERT INTO People (FName, LName, EmailAdd) VALUES ('"+req.body.firstName+"', '"+req.body.lastName+"', '"+req.body.email+"')'", function(err, results) {
            //Send back that there is an error lost or no connection
            if (err) {
                    res.statusCode = 500;
                    console.log("Error running query!");
                    return res.send('Internal Error');
            }
            else {
                //Send back that there is an error in syntax
                if(results.length === 0){
                    res.statusCode = 404;
                    return res.send('Invalid Query');
                }
                //Send back the results to the application
                else{
                console.log(results);
                res.send(results);  
                //Query to find the PID to place in the Students table
                conn.query("SELECT PID FROM People WHERE FName = '"+req.body.firstName+"' AND LName = '"+req.body.lastName+"' AND EmailAdd = '"+req.body.email+"'", function(err, results) {
                    //Send back that there is an error lost or no connection
                    if (err) {
                        res.statusCode = 500;
                        console.log("Error running query!");
                        return res.send('Internal Error');
                    }
                    //Send back that there is an error in syntax
                    else {
                        if(results.length === 0){
                            res.statusCode = 404;
                            return res.send('Invalid Query');
                        }
                        //Send back the results to the application
                        else{
                            var PID = results;
                            console.log(results);
                            next();
                        }
                    }
                });
                //Add the person to the Students table ----------------------------------
                conn.query("INSERT INTO Students (SID) VALUES (" + PID + ");", function(err, results) {
                    //Send back that there is an error lost or no connection
                    if (err) {
                        res.statusCode = 500;
                        console.log("Error running query!");
                        return res.send('Internal Error');
                    }
                    //Send back that there is an error in syntax
                    else {
                        if(results.length === 0){
                            res.statusCode = 404;
                            return res.send('Invalid Query');
                        }
                        //Send back the results to the application
                        else{
                            console.log(results);
                            res.send(results);  
                            next();
                        }
                    }
                });
                next();
                }
            }
        });
    });
});

//Get all transfer student info ( school, major minor and classes)
app.get("/api/AddClasses",function(req,res){

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    //req.body.School, req.body.Major, req.body.Minor, req.body.Class --> These are taken from the user input.
    conn.query("INSERT INTO Students (StudentSchool, StudentMajor, StudentMinor, ClassesTaken) VALUES ('"+req.body.School+"', '"+req.body.Major+"', '"+req.body.Minor+"', '"+req.body.Class+"')'", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        else
        {
            res.send(results);  
        }

    });
});

});

//get Marist Majors
app.get("/api/Major_Classes/:MajorID",function(req,res){

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.query("SELECT * from Major_Classes.dbo.Marist_Majors where MajorID = "+req.params.majorid, function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        else
        {
            res.send(results);  
        }

    });
});

});

//get Marist Minors
app.get("/api/Minor_Classes/:MinorID",function(req,res){

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.query("SELECT * FROM Minor_Classes.dbo.Marist_Minor WHERE MinorID = "+req.params.minorid, function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        else
        {
            res.send(results);  
        }

    });
});

});



app.listen(3000);

console.log('Listening on port 22...');