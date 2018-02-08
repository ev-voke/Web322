/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Jasdeep Sandhu          Date: November 17, 2017
*
********************************************************************************/

//use of modules
const express = require('express');
const app = express();
const path = require("path");
const data_service = require('./data-service');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//allow use of local files
app.use(express.static('public'));

//ensure bodyParder middleware works correctly
//and allow .hbs extensions to be handled correctly
//add the custom Handlebars helper: "equal" and set the global default layout to our layout.hbs file
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({ 
    extname: ".hbs", 
    defaultLayout: 'layout',
    helpers: { 
        equal: function (lvalue, rvalue, options) { 
            if (arguments.length < 3) {
                throw new Error("Handlebars Helper equal needs 2 parameters"); 
            }
            if (lvalue != rvalue) { 
                return options.inverse(this); 
            } else { 
                return options.fn(this); 
            }
        }
    }
}));
app.set("view engine", ".hbs");

//server must listen on port
let HTTP_PORT = process.env.PORT || 8080;

//server must output 'listening to port' to console
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//routes
app.get("/", (req,res) => {
    res.render("home");
});
app.get("/about", (req,res) => {
    res.render("about");
});
app.get("/employees", (req,res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status)
        .then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        })
        .catch((reason) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } 
    else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department)
        .then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        })
        .catch((reason) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } 
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager)
        .then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        })
        .catch((reason) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    } 
    else if (req.query) {
        data_service.getAllEmployees()
        .then((data) => {
            res.render("employeeList", { data: data, title: "Employees" });
        })
        .catch((reason) => {
            res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
});
app.get("/employee/:empNum", (req,res) => { 
        data_service.getEmployeeByNum(req.params.empNum)
        .then((data) => {
            res.render("employee", { data: data });
        })
        .catch((reason) => {
            res.status(404).send("Employee Not Found");
        });  
});
app.get("/managers", (req,res) => {
    if (req.query) {
        data_service.getManagers()
        .then((data) => {
            res.render("employeeList", { data: data, title: "Employees (Managers)" });
        })
        .catch((reason) => {
            res.render("employeeList", { data: {}, title: "Employees (Managers)" });
        });
    } 
});
app.get("/departments", (req,res) => {
    if (req.query) {
        data_service.getDepartments()
        .then((data) => {
            res.render("departmentList", { data: data, title: "Departments" });
        })
        .catch((reason) => {
            res.render("departmentList", { data: {}, title: "Departments" });
        });
    } 
});
app.get("/employees/add", (req,res) => {
    res.render("addEmployee"); 
}); 
app.post("/employees/add", (req, res) => {
    console.log(req.body);
    data_service.addEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
});
app.post("/employee/update", (req, res) => {
    console.log(req.body);
    data_service.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
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
