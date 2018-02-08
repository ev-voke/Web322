/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students
*
* Name: Jasdeep Sandhu          Date: October 1, 2017
*
********************************************************************************/ 

//use of modules
const express = require('express');
const app = express();
const path = require("path");
const data_service = require('./data-service');
//allow use of local files
app.use(express.static('public'));

//server must listen on port
let HTTP_PORT = process.env.PORT || 8080;

//server must output 'listening to port' to console
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//routes
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});
app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});
app.get("/employees", (req,res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status)
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    } 
    else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department)
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    } 
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager)
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    } 
    else if (req.query) {
        data_service.getAllEmployees().then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    }
});
app.get("/employee/:value", (req,res) => { 
        data_service.getEmployeeByNum(req.params.value)
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });  
});
app.get("/managers", (req,res) => {
    if (req.query) {
        data_service.getManagers()
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    } 
});
app.get("/departments", (req,res) => {
    if (req.query) {
        data_service.getDepartments()
        .then((data) => {
            res.json(data);
        })
        .catch((reason) => {
            res.send("{Error: " + reason + "}");
        });
    } 
});
app.use((req,res) => {
    res.status(404).send("Page Not Found")
});

//setup http server to listen on HTTP_PORT
data_service.initialize()
.then((message) => {
    console.log(message);
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((reason) => {
    console.log(reason);
});
