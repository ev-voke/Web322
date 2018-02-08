/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jasdeep Sandhu          Date: September 21, 2017
*
********************************************************************************/

//use of express module
var express = require("express");
var app = express();
//allow use of local css file
app.use(express.static('public'));

//server must listen on port
var HTTP_PORT = process.env.PORT || 8080;

//use of path module (to retrieve html files from dir) (Windows-style paths)
var path = require("path");

//server must output 'listening to port' to console
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
};

//route to home.html
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

//route to about.html
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

//setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
