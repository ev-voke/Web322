var employees = [];
var departments = [];
var empCount = 0;

const fs = require('fs');

//functions (=>)
module.exports = {
    initialize: () => {
        return new Promise((resolve,reject) => {
            try {
                fs.readFile('./data/employees.json', (err, data) => {
                    employees = JSON.parse(data);
                    empCount = employees.length;
                });
            } catch(ex) {
                reject("unable to read employees file");
            }

            try {
                fs.readFile('./data/departments.json', (err, data) => {
                    departments = JSON.parse(data);
                });
            } catch(ex) {
                reject("unable to read department file");
            }
            if(employees && departments) {
                resolve("Both files parsed successfully");
            }
        });
    },
    getAllEmployees: () => {
        return new Promise((resolve, reject) => {
            if(!employees.length == 0) {
                resolve(employees);
            }else{
                reject("No Employee Results Returned");
            }
        });
    },
    getEmployeesByStatus: (status) => {   
        return new Promise((resolve, reject) => {
            var statusArray = [];
            for(let i=0; i<employees.length; i++) {
                if(employees[i].status === status) {
                    statusArray.push(employees[i]);
                }
            }
            if(!statusArray.length == 0) {
                resolve(statusArray);
            } 
            else {
                reject("No Employee Status Results Returned");
            }
        });
    },
    getEmployeesByDepartment: (department) => {
        return new Promise((resolve, reject) => {
            var departmentArray = [];
            for(let i=0; i<employees.length; i++) {
                if(employees[i].department == department) {
                    departmentArray.push(employees[i]);
                }
            }
            if(!departmentArray.length == 0) {
                resolve(departmentArray);
            } 
            else {
                reject("No Employee Department Results Returned");
            }
        });
    },
    getEmployeesByManager: (manager) => {
        return new Promise((resolve, reject) => {
            var managerArray = [];
            for(let i=0; i<employees.length; i++) {
                if(employees[i].employeeManagerNum == manager) {
                    managerArray.push(employees[i]);
                }
            }
            if(!managerArray.length == 0) {
                resolve(managerArray);
            } 
            else {
                reject("No Employee Manager Results Returned");
            }
        });
    },
    getEmployeeByNum: (empNum) => { // <---------------- FIX THIS !!!!!!!!!!!
        return new Promise((resolve, reject) => {
            for(let i=0; i<employees.length; i++) {
                if(employees[i].employeeNum == empNum) {
                    resolve(employees[i]);
                }
            }
           reject("No Employee Number Results Returned");
        });
    },
    getManagers: () => {
        return new Promise((resolve, reject) => {
            var getManagersArray = [];
            for(let i=0; i<employees.length; i++) {
                if(employees[i].isManager == true) {
                    getManagersArray.push(employees[i]);
                }
            }
            if(!getManagersArray.length == 0) {
                resolve(getManagersArray);
            } 
            else {
                reject("No Manager Results Returned");
            }
        });
    },
    getDepartments: () => {
        return new Promise((resolve, reject) => {
            if(!departments.length == 0) {
                resolve(departments);
            } 
            else {
                reject("No Departments Results Returned");
            }
        });
    },
    addEmployee: (employeeData) => {
        return new Promise((resolve, reject) => {
            empCount++;
            employeeData.employeeNum = empCount;
            employees.push(employeeData);
            resolve();
        });
    },
    updateEmployee: (employeeData) => {
        return new Promise((resolve, reject) => {
            for(let i=0; i<employees.length; i++) {
                if(employees[i].employeeNum == employeeData.employeeNum) {
                    employees[i] = employeeData;
                }
            }
            resolve();
        });
    }
};