/*********************************************************************************
* WEB322 – Assignment 07
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Jasdeep Sandhu          Date: January 1, 2018
*
**********************************************************************************/

//use of modules
const express = require('express');
const app = express();
const path = require('path');
const data_service = require('./data-service');
const dataServiceComments = require('./data-service-comments.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const clientSessions = require ('client-sessions');
const dataServiceAuth = require('./data-service-auth.js');

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

//custom middleware so templates have access to a "session" object so only current logged in users have access to them
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});


//check if user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

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
    dataServiceComments.getAllComments()
    .then((dataFromPromise) => {
        res.render("about", {data: dataFromPromise});
    }).catch(() => {
        res.render("about");
    });
});
app.get("/employees", ensureLogin, (req,res) => { 
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
app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};

    data_service.getEmployeeByNum(req.params.empNum)
    .then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(()=>{
        viewData.data = null; // set employee to null if there was an error
    }).then(data_service.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
       
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data[0].department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(()=>{
        viewData.departments=[]; // set departments to empty if there was an error
    }).then(()=>{
        if(viewData.data == null){ // if no employee - return an error
            res.status(404).send("Employee Not Found");
        }else{
            res.render("employee", { viewData: viewData }); // render the "employee" view
            
            //!!!!! IMPORTANT NOTE TO SELF: 
            //  Using the example of 'viewData.data.firstName' (or any other property) produces an 'undefined' product.
            //  Despite the 'viewData.data' object being the length of 1 the product of 'viewData.data.firstName' will not prove successful.
            //  Console logging 'viewData.data' produces [object SequelizeInstance: 'tablename']. 
            //  JS SOLUTION: access the index of the object. Simply using 'data[0].firstName' to access data.
            //  HTML SOLUTION: For the handlebars in 'employee.hbs' we also access the indexes.
            //                 But we can't use '{{viewData.data[0].firstName}}' in HTML, instead we use '{{viewData.data.0.firstName}}'.
            //  Same goes for 'department.hbs'.
        }
    });
});
app.get("/managers", ensureLogin, (req,res) => {
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
app.get("/departments", ensureLogin, (req,res) => {
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
app.get("/employees/add", ensureLogin, (req,res) => {
    data_service.getDepartments()
    .then((data) => {
        res.render("addEmployee", {departments: data});
    })
    .catch((reason) => {
        res.render("addEmployee", {departments: []});        
    }); 
}); 
app.post("/employees/add", ensureLogin, (req, res) => {
    data_service.addEmployee(req.body)
    .then((data) => {
        res.redirect("/employees");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
});
app.post("/employee/update", ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body)
    .then((data) => {
        res.redirect("/employees");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
});   
app.get("/departments/add", ensureLogin, (req,res) => {
    res.render("addDepartment"); 
}); 
app.post("/department/add", ensureLogin, (req, res) => {
    data_service.addDepartment(req.body)
    .then((data) => {
        res.redirect("/departments");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
});
app.post("/department/update", ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body)
    .then((data) => {
        res.redirect("/departments");
    })
    .catch((reason) => {
        res.send("{Error: " + reason + "}");
    });
}); 
app.get("/department/:departmentId", ensureLogin, (req,res) => {
    data_service.getDepartmentById(req.params.departmentId)
    .then((data) => {
        res.render("department", { data: data });
    })
    .catch((reason) => {
        res.status(404).send("Department Not Found");
    });  
});
app.get("/employee/delete/:empNum", ensureLogin, (req,res) => { 
    data_service.deleteEmployeeByNum(req.params.empNum)
    .then((data) => {
        res.redirect("/employees");
    })
    .catch((reason) => {
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    });
});
app.post("/about/addComment", (req, res) => {
    dataServiceComments.addComment(req.body)
    .then((data) => {
        res.redirect("/about");
    })
    .catch((reason) => {
        console.log("addComment Error: " + reason);
        res.redirect("/about");
    });
}); 
app.post("/about/addReply", (req, res) => {
    dataServiceComments.addReply(req.body)
    .then((data) => {
        res.redirect("/about");
    })
    .catch((reason) => {
        console.log("addReply Error: " + reason);
        res.redirect("/about");
    });
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
    .then((data) => {
        res.render("register", {successMessage: "User created"});
    })
    .catch((err) => {
        res.render("register", {errorMessage: err, user: req.body.user});
    });
});
app.post("/login", (req, res) => {
    dataServiceAuth.checkUser(req.body)
    .then((data) => {
        // Add the user on the session and redirect them to the dashboard page.
        req.session.user = {
            username: req.body.user
        };
        res.redirect("/employees");
    })
    .catch((err) => {
        res.render("login", {errorMessage: err, user: req.body.user});
    });
});
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});
app.use((req,res) => {
    res.status(404).send("Page Not Found")
});

//setup http server to listen on HTTP_PORT
data_service.initialize()
.then(dataServiceComments.initialize)
.then(dataServiceAuth.initialize)
.then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((err)=>{
    console.log("unable to start the server: " + err);
});
