var express = require('express');
var app = express();

var pg = require('pg');
var conString = "postgres://postgres:alpaca@localhost:5432/transfercredits";
var client = new pg.Client(conString);
client.connect();


//Spinning up an API server on the local host @ port 3000
var server = app.listen(3000, function () {
                        var host = server.address().address;
                        var port = server.address().port;
                        });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('connect').bodyParser());

//-------------------------------------------------------------------------------------------------------GETS-------------------------------------------------------------------------------------------------------

//Completed
//Will be used to return a list of subjects for DCC classes
app.get('/Subjects',function (req, res){
        //Initialize an Array to hold the subjects
        var subjectArray = new Array();
        //Query to find the avalible subjects
        var query = client.query("SELECT DISTINCT Subject FROM D_Classes Order By Subject;");
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 subjectArray.push(row);
                 });
        
        //Ends the query
        query.on('end', function(result) {
                 //Return the array with subjects
                 res.send(subjectArray);
                 });
        });

//Completed
//Will be used to return a list of Marist Majors
app.get('/Majors',function (req, res){
        
        //Initialize an Array to hold the majors
        var majorArray = new Array();
        //Query to find the avalible majors
        var query = client.query("SELECT DISTINCT MajorName FROM M_Majors Order By MajorName;");
        
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 majorArray.push(row);
                 });
        
        //Ends the query
        query.on('end', function(result) {
                 var jsonObj = {
                 majors:majorArray
                 }
                 //Return the array with majors
                 res.send(jsonObj);
                 });
        });

//Completed
//Will be used to return a list of Marist Minors
app.get('/Minors',function (req, res){
        
        //Initialize an Array to hold the minors
        var minorArray = new Array();
        //Query to find the avalible minors
        var query = client.query("SELECT DISTINCT MinorName FROM M_Minors Order By MinorName;");
        
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 minorArray.push(row);
                 });
        
        //Ends the query
        query.on('end', function(result) {
                 //Return the array with minors
                 res.send(minorArray);
                 });
        });

//Completed
//Will be used to get the CourseNum of DCC classes where the Subject = "the given subject"
app.get('/DCCCourseInfo/:subject', function (req, res) {
        //Set this param to the subject passed in. Subject must be in CAPS to work MATH:Right Math:Wrong
        var subjectParam = req.params.subject;
        //Array to store the list of CourseNums
        var courseNumArray = new Array();
        
        //Query will find all DCC CourseNums where the Subject  = "The given subject"
        var query = client.query("SELECT CourseName, CourseNum, Credits FROM D_Classes WHERE Subject = '" + subjectParam + "' Order By CourseNum;");
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 courseNumArray.push(row);
                 });
        //Ends the query
        query.on('end', function(result) {
                 var jsonObj = {
                 [subjectParam]:courseNumArray
                 }
                 //Return the json object
                 res.send(jsonObj);
                 });
        });

//Completed
//Will be used to get the classes that are needed for a specific major
app.get('/MajorCourseInfo/:major', function (req, res) {
        //Set this param to the major passed in.
        var majorParam = req.params.major;
        //Array to store the list of classes
        var courseArray = new Array();
        
        //Query will find all marist classes that match to the given major
        var query = client.query("SELECT CourseName, CourseNum, Credits FROM M_Classes, Major_Classes, M_Majors WHERE M_Classes.MarID = Major_Classes.MarID AND Major_Classes.MJID = M_Majors.MJID AND M_Majors.MajorName = '" + majorParam + "';");

        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 courseArray.push(row);
                 });
        //Ends the query
        query.on('end', function(result) {
                 //Make a json object
                 var jsonObj = {
                 [majorParam]:courseArray
                 }
                 //Return the json object
                 res.send(jsonObj);
                 });
        });

//Completed
//Will be used to get the classes that are needed for a specific minor
app.get('/MinorCourseInfo/:minor', function (req, res) {
        //Set this param to the minor passed in.
        var minorParam = req.params.minor;
        //Array to store the list of classes
        var courseArray = new Array();
        
        //Query will find all marist classes that match to the given minor
        var query = client.query("SELECT CourseName, CourseNum, Credits FROM M_Classes, Minor_Classes, M_Minors WHERE M_Classes.MarID = Minor_Classes.MarID AND Minor_Classes.MinID = M_Minors.MinID AND M_Minors.MinorName = '" + minorParam + "';");
        
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 courseArray.push(row);
                 });
        //Ends the query
        query.on('end', function(result) {
                 //Make a json object
                 var jsonObj = {
                 [minorParam]:courseArray
                 }
                 //Return the json object
                 res.send(jsonObj);
                 });
        });

//Completed
//Will be used to get the classes that are associated with a specifed sesID
app.get('/StudentCourseInfo/:sesID', function (req, res) {
        //Set this param to the sesID passed in.
        var sesIDParam = req.params.sesID;
        //Array to store the list of classes
        var courseArray = new Array();
        //Query will find all marist classes that match to the given sesID
        var query = client.query("SELECT D_Classes.DID, D_Classes.CourseName, D_Classes.Subject, D_Classes.CourseNum, D_Classes.Credits FROM D_Classes, Student_Classes, Students, Sessions WHERE D_Classes.DID = Student_Classes.DID AND Student_Classes.SID = Students.SID AND Students.SID = Sessions.SID AND Sessions.SesID ='" + sesIDParam + "';");
        //Call on query to place the query results into the array
        query.on("row", function(row){
                 //Pushes the json object into the array
                 courseArray.push(row);
                 });
        //Ends the query
        query.on('end', function(result) {
                 //Make a json object containing the sesID and the courseArray
                 var jsonObj = {sesID:sesIDParam, studentClasses:courseArray}
                 //Return the json object
                 res.send(jsonObj);
                 });
        });

//Completed
//Will be used to find the Marist equivalent of a DCC class
app.get('/MaristTransferClasses/:major/:emailAdd', function (req, res) {
        //Set this param to the courseNum passed in.
        var majorNameParam = req.params.major;
        //Set this param to the EmailAdd passed in
        var emailAddParam = req.params.emailAdd;
        //Array to hold the current selected Major classes
        var majorClassesArray = new Array();
        //Array to hold the classes that transfer but not towards a major
        var nonMajorClassesArray = new Array();
        //var to store the classes that dont transfer
        var nonTransferClassesArray = new Array();
        var creditTotal = 0;
        var majorCreditTotal = 0;
        var majorCreditsNeeded =0;
        //Query will find all marist classes that are equivelent to DCC classes the student took in the specified major
        var query1 = client.query("SELECT M_Classes.MarID, M_Classes.CourseName, M_Classes.CourseNum, M_Classes.Subject, M_Classes.Credits FROM M_Classes, Major_Classes, M_Majors, D_Classes, Student_Classes, Students, People, Cred_Transfers WHERE M_Classes.MarID = Major_Classes.MarID AND Major_Classes.MJID = M_Majors.MJID AND M_Majors.MajorName = '" + majorNameParam + "' AND D_Classes.DID = Student_Classes.DID AND Student_Classes.SID = Students.SID AND Students.SID = People.PID AND People.emailAdd ='" + emailAddParam + "' AND M_Classes.MarID = Cred_Transfers.MarID AND D_Classes.DID = Cred_Transfers.DID ;");
        //Call on query to place the query results into the array
        query1.on("row", function(row){
                  //Pushes the json object into the array
                  majorClassesArray.push(row);
                  majorCreditTotal = majorCreditTotal + parseInt(row.credits);
                  creditTotal = majorCreditTotal;
                 });
        //Query will find all marist classes that are equivelent to DCC classes the student took that are not in the specified major
        var query2 = client.query("SELECT DISTINCT M_Classes.MarID, M_Classes.CourseName, M_Classes.CourseNum, M_Classes.Subject, M_Classes.Credits FROM M_Classes, D_Classes, Student_Classes, Students, People, Cred_Transfers WHERE D_Classes.DID = Student_Classes.DID AND Student_Classes.SID = Students.SID AND Students.SID = People.PID AND People.emailAdd ='" + emailAddParam + "' AND M_Classes.MarID = Cred_Transfers.MarID AND D_Classes.DID = Cred_Transfers.DID AND M_Classes.MarID NOT IN (SELECT DISTINCT M_Classes.MarID FROM M_Classes, Major_Classes, M_Majors WHERE M_Classes.MarID = Major_Classes.MarID AND Major_Classes.MJID = M_Majors.MJID AND M_Majors.MajorName = '" + majorNameParam + "');");
        //Call on query to place the query results into the array
        query2.on("row", function(row){
                  //Pushes the json object into the array
                  nonMajorClassesArray.push(row);
                  creditTotal = creditTotal + parseInt(row.credits);
                 });
        //Query will check if any classes did not transfer to Marist
        var query3 = client.query("SELECT DISTINCT D_Classes.DID, D_Classes.CourseName, D_Classes.CourseNum, D_Classes.Subject FROM Cred_Transfers, D_Classes WHERE D_Classes.DID NOT IN (SELECT DISTINCT Cred_Transfers.DID FROM Cred_Transfers);");
        //Call on query to place the query results into the array
        query3.on("row", function(row){
                  //Pushes the json object into the array
                  nonTransferClassesArray.push(row);
                  });
        //query to grab the credits needed to complete the major
        var query4 = client.query("SELECT DISTINCT M_Majors.totalcredits FROM M_Majors WHERE M_Majors.MajorName = '" + majorNameParam + "';");
        query4.on("row", function(row){
                  //Set the majorCredits needed to whe result of the query
                  majorCreditsNeeded =  parseInt(row.totalcredits);
                  });
        //Ends the query
        query4.on('end', function(result) {
                  //Return a json object with the three arrays
                  res.send({creditsNeeded: 120, majorCreditsNeeded: majorCreditsNeeded, creditTotal:creditTotal, majorCreditTotal: majorCreditTotal, majorClasses:majorClassesArray,nonMajorClasses: nonMajorClassesArray,nonTransferClasses: nonTransferClassesArray});
                  });
        });

//Will return a json object with the Dcc_Classes and Marist_Classes that map to each other
app.get('/ClassMappings', function (req, res) {
        //Array to hold the Marist class information
        var mClassesArray = new Array();
        //Array to hold the DCC Class information
        var dClassesArray = new Array();
        //Query will find all marist classes that are equivelent to DCC classes the student took in the specified major
        var query1 = client.query("SELECT DISTINCT M_Classes.MarID, M_Classes.CourseName, M_Classes.CourseNum, M_Classes.Subject, M_Classes.Credits, D_Classes.DID FROM M_Classes, D_Classes, Cred_Transfers WHERE M_Classes.MarID = Cred_Transfers.MarID AND D_Classes.DID = Cred_Transfers.DID Order By M_Classes.MarID;");
        //Call on query to place the query results into the array
        query1.on("row", function(row){
                  //Pushes the json object into the array
                  mClassesArray.push(row);
                  });
        
        //Query to find the DCC classes that map
        var query2 = client.query("SELECT DISTINCT M_Classes.MarID, D_Classes.DID, D_Classes.CourseName, D_Classes.CourseNum, D_Classes.Subject, D_Classes.Credits FROM M_Classes, D_Classes, Cred_Transfers WHERE M_Classes.MarID = Cred_Transfers.MarID AND D_Classes.DID = Cred_Transfers.DID Order By M_Classes.MarID;");
        //Call on query to place the query results into the array
        query2.on("row", function(row){
                  //Pushes the json object into the array
                  dClassesArray.push(row);
                  });
        //Ends the query
        query2.on('end', function(result) {
                 //Make a json object containing the sesID and the courseArray
                  var jsonObj = {mClasses:mClassesArray, dClasses:dClassesArray}
                 //Return the json object
                 res.send(jsonObj);
                 });
        });


/*//Completed
//Will be used to find a session belonging to a specified email
app.get('/SesID/:emailAdd', function (req, res) {
        //Set this param to the EmailAdd passed in
        var emailAddParam = req.params.emailAdd;
        //var to store the sesID
        var sesID;
        //Query will find the session belonging to a specific email address
        var query = client.query("SELECT Sessions.SesID FROM Sessions, Students, People WHERE Sessions.SID = Students.SID AND Students.SID = People.PID AND People.EmailAdd = '" + emailAddParam + "';");
        
        //Call on query to place the query result into a variable
        query.on("row", function(row){
                 //Set the sesId to the variable
                 sesID = row.sesid;
                 });
        //Ends the query
        query.on('end', function(result) {
                 //Send the sesID
                 res.send(sesID);
                 });
        });*/

//-------------------------------------------------------------------------------------------------------POSTS-------------------------------------------------------------------------------------------------------


//Completed will also check to make sure an email is not already being used
//Will insert a student into the people table and into the student table
app.post('/InsertStudent/:fname/:lname/:emailAdd', function(req, res){
         
         //Set this param to the first name passed in
         var firstNameParam = req.params.fname;
         //Set this param to the last name passed in
         var lastNameParam = req.params.lname;
         //Set this param to the EmailAdd passed in
         var emailAddParam = req.params.emailAdd;
         //Variable for queryCheck
         var check = new Array();
         //Initialize a variable to store the PID
         var pid;
         //Check to make sure that an email is not already in use
         var queryCheck = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
         queryCheck.on("row", function(row){
                       check.push(row);
                       });
         queryCheck.on('end', function(result){
                       if(check.length > 0){
                       res.sendStatus(500);
                       }
                       else{
                       //Used for inserting into the People table
                       var query1 = client.query("INSERT INTO People(FName, LName, EmailAdd) VALUES('" + firstNameParam + "', '" + lastNameParam + "', '" + emailAddParam + "');");
                       //Query to find the PID of the inserted person
                       var query2 = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
                       //Call on query to place the query results into the array
                       query2.on("row", function(row){
                                 pid = parseInt(row.pid);
                                 });
                       //Ends the query
                       query2.on('end', function(result) {
                                 //Inserts a student into the student table
                                 var query3 = client.query("INSERT INTO Students(SID) VALUES('" + parseInt(pid) + "');");
                                 
                                 res.sendStatus(203);
                                 });
                       }
                       });
         });

//Completed will also check to make sure an email is not already being used
//Will insert an admin into the people table and into the admin table
app.post('/InsertAdmin/:fname/:lname/:emailAdd/:password', function(req, res){
         //Set this param to the first name passed in
         var firstNameParam = req.params.fname;
         //Set this param to the last name passed in
         var lastNameParam = req.params.lname;
         //Set this param to the EmailAdd passed in
         var emailAddParam = req.params.emailAdd;
         //Set this param to the EmailAdd passed in
         var passwordParam = req.params.password;
         //Variable for queryCheck
         var check = new Array();
         //Initialize a variable to store the PID
         var pid;
         //Check to make sure that an email is not already in use
         var queryCheck = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
         queryCheck.on("row", function(row){
                       check.push(row);
                       });
         queryCheck.on('end', function(result){
                       if(check.length > 0){
                       res.sendStatus(500);
                       }
                       else{
                       //Used for inserting into the People table
                       var query1 = client.query("INSERT INTO People(FName, LName, EmailAdd) VALUES('" + firstNameParam + "', '" + lastNameParam + "', '" + emailAddParam + "');");
                       //Query to find the PID of the inserted person
                       var query2 = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
                       //Call on query to place the query results into the array
                       query2.on("row", function(row){
                                 pid = parseInt(row.pid);
                                 });
                       //Ends the query
                       query2.on('end', function(result) {
                                 //Inserts an admin into the admin table
                                 var query3 = client.query("INSERT INTO Admins(AID, Password) VALUES('" + parseInt(pid) + "','" + passwordParam + "');");
                                 //Inserts an admin into the student table to allow them to do mock evaluations
                                 var query4 = client.query("INSERT INTO Students(SID) VALUES('" + parseInt(pid) + "');");
                                 res.sendStatus(203);
                                 });
                       }
                       });
         });


//Will insert a student class into Student_Classes
app.post('/InsertStudentClasses', function(req, res){

         //Set this param to the jsonObj passed in the body
         var jsonObjParam = req.body;
         //Set this param to the emailAdd taken from the json object
         var emailAddParam = jsonObjParam.student_classes.emailAdd;
         //Initialize a variable to store the SID
         var sid;
         //Initialize an array to store the DIDs
         var didArrayParam = new Array();
         //Query to find the PID/SID that is associated with the given EmailAddress
         var query1 = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
         //Call on query to place the query results into the array
         query1.on("row", function(row){
                   sid = parseInt(row.pid)
                   });
         //Ends the query
         query1.on('end', function(result) {
                   //Variable to store the student class information
                   var courseArrayParam = jsonObjParam.student_classes.session;
                   //Loop through the jsonArray
                   for(var x =0; x<courseArrayParam.length; x++){
                   //Look for the did's of the classes provided
                   var query2 = client.query("SELECT DID FROM D_Classes WHERE '" + courseArrayParam[x].subject + "' = D_Classes.Subject AND '" + courseArrayParam[x].courseNum + "' = D_Classes.CourseNum;");
                   //Call on query to place the query results into the array
                   query2.on("row", function(row){
                             didArrayParam.push(row.did);
                             });
                   }
                   //Ends the query
                   query2.on('end', function(result) {
                             //Delete the classes associated with the SID
                             var query2 = client.query("DELETE FROM Student_Classes Where Student_Classes.SID = '" + sid + "';");
                             //Loop through the dids
                             for(var x =0; x<didArrayParam.length; x++){
                             //Add the courses tot he students_classes table
                             var query3 = client.query("INSERT INTO Student_Classes(DID, SID) VALUES('" + didArrayParam[x] + "', '" + parseInt(sid) + "');");
                             }
                             //Delete the session associated with the given SesID
                             var query4 = client.query("DELETE FROM Sessions Where Sessions.SID = '" + sid + "';");
                             //Insert the session into the session table
                             var query5 = client.query("INSERT INTO Sessions(SesID, SID) VALUES('" + jsonObjParam.student_classes.sesID + "', '" + parseInt(sid) + "');");
                             res.sendStatus(203);
                             });
                   });
         });


//Will delete a session from the session table and all classes associated with that session in the student Classes table
app.post('/DeleteSession/:emailAdd', function(req, res){
         //Set this param to the emailAdd passed in
         var emailAddParam = req.params.emailAdd;
         //Initialize a variable to store the SID and sesID
         var sid
         //Initialize a variable to store the sesID
         var sesID;
         //Array for checking
         var check = new Array()
         //Query to find the PID/SID that is associated with the given EmailAddress
         var query1 = client.query("SELECT Sessions.SesID, Sessions.SID FROM Sessions, Students , People WHERE Sessions.SID = Students.SID AND Students.SID = People.PID AND People.EmailAdd = '"+ emailAddParam +"';");
         //Call on query to place the query results into the variables
         query1.on("row", function(row){
                   //check to make sure that we are getting something from the query
                   check.push(row);
                   if(check.length > 0){
                   sesID = parseInt(row.sesid);
                   sid = parseInt(row.sid);
                   }
                   });
         //Ends the query
         query1.on('end', function(result) {
                   if(check.length > 0){
                   //Delete the session associated with the given SesID
                   var query2 = client.query("DELETE FROM Sessions Where Sessions.SesID = '" + sesID + "' AND Sessions.SID = '" + sid + "';");
                   //Delete the classes associated with the SID
                   var query3 = client.query("DELETE FROM Student_Classes Where Student_Classes.SID = '" + sid + "';");
                   //Notify that it has been deleted
                   res.sendStatus(203);
                   }
                   else{
                   res.sendStatus(500);
                   }
                   });
         });


//Will insert a Marist Class into the database
app.post('/InsertMaristClass', function(req, res){
         //Set this param to the jsonObj passed in the body
         var jsonObjParam = req.body;
         //Set this param to the subject taken from the json object
         var subjectParam = jsonObjParam.subject;
         //Set this param to the courseNum taken from the json object
         var courseNumParam = jsonObjParam.courseNum;
         //Set this param to the courseName taken from the json object
         var courseNameParam = jsonObjParam.courseName;
         //Set this param to the credits taken from the json object
         var creditsParam = jsonObjParam.credits;
         //Variable for queryCheck
         var check = new Array();
         //Query to check that this class does not already exist in the M_Classes Table
         var queryCheck = client.query("SELECT * FROM M_Classes WHERE M_Classes.Subject = '"+ subjectParam +"' AND M_Classes.courseNum = '" + courseNumParam + "';");
         queryCheck.on("row", function(row){
                       check.push(row);
                       });
         queryCheck.on('end', function(result){
                       if(check.length > 0){
                       res.sendStatus(500);
                       }
                       else{
                       //Used for inserting into the M_Classes table
                       var query1 = client.query("INSERT INTO M_Classes(Subject, courseNum, courseName, credits) VALUES('" + subjectParam + "', '" + courseNumParam + "', '" + courseNameParam + "', '" + creditsParam + "');");
                       res.sendStatus(203);
                       }
                       });
         });


//Will insert a Dutchess Class into the database
app.post('/InsertDutchessClass', function(req, res){
         //Set this param to the jsonObj passed in the body
         var jsonObjParam = req.body;
         //Set this param to the subject taken from the json object
         var subjectParam = jsonObjParam.subject;
         //Set this param to the courseNum taken from the json object
         var courseNumParam = jsonObjParam.courseNum;
         //Set this param to the courseName taken from the json object
         var courseNameParam = jsonObjParam.courseName;
         //Set this param to the credits taken from the json object
         var creditsParam = jsonObjParam.credits;
         //Variable for queryCheck
         var check = new Array();
         //Query to check that this class does not already exist in the D_Classes Table
         var queryCheck = client.query("SELECT * FROM D_Classes WHERE D_Classes.Subject = '"+ subjectParam +"' AND D_Classes.courseNum = '" + courseNumParam + "';");
         queryCheck.on("row", function(row){
                       check.push(row);
                       });
         queryCheck.on('end', function(result){
                       if(check.length > 0){
                       res.sendStatus(500);
                       }
                       else{
                       //Used for inserting into the D_Classes table
                       var query1 = client.query("INSERT INTO D_Classes(Subject, courseNum, courseName, credits) VALUES('" + subjectParam + "', '" + courseNumParam + "', '" + courseNameParam + "', '" + creditsParam + "');");
                       res.sendStatus(203);
                       }
                       });
         });


//Will insert a Class mapping into the database
app.post('/InsertClassMapping', function(req, res){
         //Set this param to the jsonObj passed in the body
         var jsonObjParam = req.body;
         //Set this param to the maristSubject taken from the json object
         var maristSubjectParam = jsonObjParam.maristSubject;
         //Set this param to the maristCourseNum taken from the json object
         var maristCourseNumParam = jsonObjParam.maristCourseNum;
         //Set this param to the dutchessSubject taken from the json object
         var dutchessSubjectParam = jsonObjParam.dutchessSubject;
         //Set this param to the dutchessCourseNum taken from the json object
         var dutchessCourseNumParam = jsonObjParam.dutchessCourseNum;
         //Variable for queryCheck
         var check1 = new Array();
         var check2 = new Array();
         var check3 = new Array();
         //Initialize variables to store a did and a marID
         var marid;
         var did;
         //Find the marID of the marist class passed in
         var query1 = client.query("SELECT M_Classes.MarID FROM M_Classes WHERE M_Classes.Subject = '" + maristSubjectParam + "' AND M_Classes.courseNum = '" + maristCourseNumParam + "';");
         query1.on("row", function(row){
                   check1.push(row);
                   if(check1.length > 0){
                   marid = row.marid;
                   //Find the DID of the dutchess class passed in
                   var query2 = client.query("SELECT D_Classes.DID FROM D_Classes WHERE D_Classes.Subject = '" + dutchessSubjectParam + "' AND D_Classes.courseNum = '" + dutchessCourseNumParam + "';");
                   query2.on("row", function(row){
                             check2.push(row);
                             if(check2.length > 0){
                             did = row.did;
                             //Query to check that this class mapping does not already exist in the Cred_Transfers
                             var queryCheck = client.query("SELECT * FROM Cred_Transfers WHERE Cred_Transfers.MarID = '"+ marid +"' AND Cred_Transfers.DID = '" + did + "';");
                             queryCheck.on("row", function(row){
                                           check3.push(row);
                                           });
                             queryCheck.on('end', function(result){
                                           if(check3.length > 0){
                                           res.sendStatus(500);
                                           }
                                           else{
                                           //Used for inserting into the Cred_Transfers table
                                           var query1 = client.query("INSERT INTO Cred_Transfers(DID, MarID) VALUES('" + did + "', '" + marid + "');");
                                           res.sendStatus(203);
                                           }
                                           });
                             }
                             });
                   }
                   });
                  });



//Will delete the selected class form the M_Classes table and any mapping it currently has in the Cred_Transfers table
app.post('/DeleteMaristClass/:subject/:courseNum', function(req, res){
         //Set this param to the subject passed in
         var subjectParam = req.params.subject;
         //Set this param to the courseNum passed in
         var courseNumParam = req.params.courseNum;
         //Initialize a variable to store the MarID
         var marid;
         //Array for query Checking
         var check = new Array();
         //Query to find the MarID associated with the Class passed in
         var query1 = client.query("SELECT M_Classes.MarID FROM M_Classes WHERE M_Classes.Subject = '" + subjectParam + "' AND M_Classes.CourseNum = '" + courseNumParam + "';");
         //Call on query to place the query results into the variables
         query1.on("row", function(row){
                   check.push(row);
                   if(check.length > 0){
                   marid = parseInt(row.marid);
                   }
                   });
         //Ends the query
         query1.on('end', function(result) {
                   if(check.length > 0){
                   //Delete the classes mapping associated with the MarID
                   var query2 = client.query("DELETE FROM Cred_Transfers WHERE Cred_Transfers.MarID = '" + marid + "';");
                   //Delete the class
                   var query3 = client.query("DELETE FROM M_Classes WHERE M_Classes.Subject = '" + subjectParam + "' AND M_Classes.CourseNum = '" + courseNumParam + "';");
                   //Notify that it has been deleted
                   res.sendStatus(203);
                   }
                   else{
                   res.sendStatus(500);
                   }
                   });
         });


//Will delete the selected class form the D_Classes table and any mapping it currently has in the Cred_Transfers table
app.post('/DeleteDutchessClass/:subject/:courseNum', function(req, res){
         //Set this param to the subject passed in
         var subjectParam = req.params.subject;
         //Set this param to the courseNum passed in
         var courseNumParam = req.params.courseNum;
         //Initialize a variable to store the DID
         var did;
         //Array for query Checking
         var check = new Array();
         //Query to find the DID associated with the Class passed in
         var query1 = client.query("SELECT D_Classes.DID FROM D_Classes Where D_Classes.Subject = '" + subjectParam + "' AND D_Classes.CourseNum = '" + courseNumParam + "';");
         //Call on query to place the query results into the variables
         query1.on("row", function(row){
                   check.push(row);
                   if(check.length > 0){
                   did = parseInt(row.did);
                   }
                   });
         //Ends the query
         query1.on('end', function(result) {
                   if(check.length > 0){
                   //Delete the classes mapping associated with the MarID
                   var query2 = client.query("DELETE FROM Cred_Transfers Where Cred_Transfers.DID = '" + did + "';");
                   //Delete the class
                   var query3 = client.query("DELETE FROM D_Classes Where D_Classes.Subject = '" + subjectParam + "' AND D_Classes.CourseNum = '" + courseNumParam + "';");
                   //Notify that it has been deleted
                   res.sendStatus(203);
                   }
                   else{
                   res.sendStatus(500);
                   }
                   });
         });


/*
//Completed
//Will insert a session into the sessions table
app.post('/InsertSession/:sesID/:emailAdd', function(req, res){
         
         //Set this param to the sesID passed in
         var sesIDParam = req.params.sesID;
         //Set this param to the emailAdd passed in
         var emailAddParam = req.params.emailAdd;
         //Initialize a variable to store the PID
         var pid;
         
         //Variable for queryCheck
         var check = new Array();
         
         //Initialize a variable to store the PID
         var pid;
         
         //Check to make sure that an email is not already in use
         var queryCheck = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
         
         queryCheck.on("row", function(row){
                       check.push(row);
                       });
         queryCheck.on('end', function(result){
                       if(check.length == 0){
                       res.send("500");
                       }
                       else{

                       //Query to find the PID of the inserted person
                       var query1 = client.query("SELECT People.PID FROM People WHERE People.EmailAdd = '"+ emailAddParam +"';");
         
                       //Call on query to place the query results into the array
                       query1.on("row", function(row){
                                 pid = parseInt(row.pid);
                   
                                 });
                       //Ends the query
                       query1.on('end', function(result) {
                   
                                 //Inserts a student into the student table
                                 var query2 = client.query("INSERT INTO Sessions(SesID, SID) VALUES('" + sesIDParam + "', '" + parseInt(pid) + "');");
                   
                                 var jsonObj = {
                                 [emailAddParam]:sesIDParam
                                 }
                                 res.send("203");
                                 });
                       }
                       });
         });
*/






