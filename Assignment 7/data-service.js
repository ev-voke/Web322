const Sequelize = require('sequelize');

var sequelize = new Sequelize('', '', '', {
    host: '',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

//functions (=>)
module.exports = {
    initialize: () => {
        return new Promise((resolve,reject) => {
            sequelize.sync()
            .then(() => {
                Employee.create();
                Department.create();
            }).then(() => {
                resolve("Successfully Synchronized Database!");
            }).catch((err) => {
                reject("Oops! Unable to Sync Database :(");
            });
        });
    },
    getAllEmployees: () => {
        return new Promise((resolve, reject) => {
            Employee.findAll({
                order: sequelize.col('employeeNum')
            }).then((data) => {
                console.log("getAllEmployees: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getAllEmployees: No Results");
                reject(err);
            });
        });
    },
    getEmployeesByStatus: (status) => {   
        return new Promise((resolve, reject) => {
            Employee.findAll({
                order: sequelize.col('employeeNum'),
                where: {
                    status: status
                }
            }).then((data) => {
                console.log("getEmployeesByStatus: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getEmployeesByStatus: No Results");
                reject(err);
            });
        });
    },
    getEmployeesByDepartment: (department) => {
        return new Promise((resolve, reject) => {
            Employee.findAll({
                order: sequelize.col('employeeNum'),
                where: {
                    department: department
                }
            }).then((data) => {
                console.log("getEmployeesByDepartment: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getEmployeesByDepartment: No Results");
                reject(err);
            });
        });
    },
    getEmployeesByManager: (manager) => {
        return new Promise((resolve, reject) => {
            Employee.findAll({
                order: sequelize.col('employeeNum'),
                where: {
                    employeeManagerNum: manager
                }
            }).then((data) => {
                console.log("getEmployeesByManager: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getEmployeesByManager: No Results");
                reject(err);
            });
        });
    },
    getEmployeeByNum: (empNum) => { 
        return new Promise((resolve, reject) => {
            Employee.findAll({
                where: {
                    employeeNum: empNum
                }
            }).then((data) => {
                console.log("getEmployeeByNum: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getEmployeeByNum: No Results");
                reject(err);
            });
        });
    },
    getManagers: () => {
        return new Promise((resolve, reject) => {
            Employee.findAll({
                order: sequelize.col('employeeNum'),
                where: {
                    isManager: true
                }
            }).then((data) => {
                console.log("getManagers: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getManagers: No Results");
                reject(err);
            });
        });
    },
    getDepartments: () => {
        return new Promise((resolve, reject) => {
            Department.findAll({
                order: sequelize.col('departmentId'),
            }).then((data) => {
                console.log("getDepartments: Successful Results");
                resolve(data);
            }).catch((err) => {
                console.log("getDepartments: No Results");
                reject(err);
            });
        });
    },
    addEmployee: (employeeData) => {
        return new Promise((resolve, reject) => {        
            sequelize.sync().then(() => {   
                employeeData.isManager = (employeeData.isManager) ? true : false;
                for(let i=0; i < employeeData.length; i++) { 
                    if(employeeData[i] == "") {
                        employeeData[i] = NULL; 
                    }
                }
                Employee.create(employeeData)
                .then((data) => {
                    console.log("Employee: " + employeeData.firstName + " " + employeeData.last_name + " created")
                    resolve(data);
                }).catch((err) => {
                    console.log("Unable to create employee");
                    reject(err);
                });
            });
        });
    },
    updateEmployee: (employeeData) => {
        return new Promise((resolve, reject) => {
            sequelize.sync().then(() => {   
                employeeData.isManager = (employeeData.isManager) ? true : false;
                for(let i=0; i < employeeData.length; i++) { 
                    if(employeeData[i] == "") {
                        employeeData[i] = NULL; 
                    }
                }
                Employee.update({
                    firstName: employeeData.firstName,
                    last_name: employeeData.last_name,
                    email: employeeData.email,
                    SSN: employeeData.SSN,
                    addressStreet: employeeData.addressStreet,
                    addresCity: employeeData.addresCity,
                    addressState: employeeData.addressState,
                    addressPostal: employeeData.addressPostal,
                    maritalStatus: employeeData.maritalStatus,
                    isManager: employeeData.isManager,
                    employeeManagerNum: employeeData.employeeManagerNum,
                    status: employeeData.status,
                    department: employeeData.department,
                    hireDate: employeeData.hireDate,
                }, {
                    where: { employeeNum: employeeData.employeeNum },
                })
                .then((data) => {
                    console.log("Employee: " + "(" + employeeData.employeeNum + ") " + employeeData.firstName + " " + employeeData.last_name + " updated")
                    resolve(data);
                }).catch((err) => {
                    console.log("Unable to update employee");
                    reject(err);
                });
            });
        });
    },
    addDepartment: (departmentData) => {
        return new Promise((resolve, reject) => {        
            sequelize.sync().then(() => {   
                for(let i=0; i < departmentData.length; i++) { 
                    if(departmentData[i] == "") {
                        departmentData[i]  = NULL; 
                    }
                }
                Department.create(departmentData)
                .then((data) => {
                    console.log("Department: " + departmentData.departmentId + " - " + departmentData.departmentName + " created")
                    resolve(data);
                }).catch((err) => {
                    console.log("Unable to create department");
                    reject(err);
                });
            });
        });
    },
    updateDepartment: (departmentData) => {
        return new Promise((resolve, reject) => {
            sequelize.sync().then(() => {
                for(let i=0; i < departmentData.length; i++) { 
                    if(departmentData[i] == "") {
                        departmentData[i] = NULL; 
                    }
                }
                Department.update({
                    departmentName: departmentData.departmentName,
                }, {
                    where: { departmentId: departmentData.departmentId }
                })
                .then((data) => {
                    console.log("Department: " + departmentData.departmentId + " - " + departmentData.departmentName + " updated")
                    resolve(data);
                }).catch((err) => {
                    console.log("Unable to update department");
                    reject(err);
                });
            });
        });
    },
    getDepartmentById: (id) => {
        return new Promise((resolve, reject) => {
            Department.findAll({
                where: {
                    departmentId: id
                }
            }).then((data) => {
                console.log("getDepartmentById: Successful Results " + id + " " + data);
                resolve(data);
            }).catch((err) => {
                console.log("getDepartmentById: No Results");
                reject(err);
            });
        });
    },
    deleteEmployeeByNum: (empNum) => {
        return new Promise((resolve, reject) => {
            Employee.destroy({
                where: { employeeNum: empNum }
            }).then((data) => {
                console.log("Employee: " + empNum + " has been deleted!");
                resolve(data);
            }).catch((err) => {
                console.log("Error! {Employee: " + empNum + "}  Desroy() method unsuccessful!");
                reject(err);
            });
        });
    }
};
