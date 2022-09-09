const express=require("express");
const inquirer = require('inquirer');
const db=require("./db/connection");
const apiRoutes=require("./routes/apiRoutes");
const PORT=process.env.PORT || 3001;
const app=express();
const baseUrl = "http://localhost:3001/api";

app.use(express.urlencoded({extended: false}));
app.use(express.json);
app.use("/api",apiRoutes);
app.use((res, req)=>{
    res.statusCode(404).endcodeURI();
});

db.connect(err => {
    if(err) throw err;
    console.log('database connected.');
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
    showMainMenu();
    });
});


async function showMainMenu(){
    return inquirer.prompt([
    {
        type: "list",
        name: "choice",
        message: "Choose one of the following",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", 
                    "add a role", "add an employee", "update an employee role"],
    },
]).then((choice) => {
    console.log(choice.choice);

    switch (choice.choice){
        case "view all departments":
            viewDepartments();
            break;
        case "view all roles":
            viewRoles();
            break;
        case "view all employees":
            viewEmployees();
            break;
            case "view employees by manager":
                viewByMgr();
                break;
            case "view employess by department":
                viewByDept();
                break;
        case "add a department":
            addDept();
            break;
        case "add a role":
            addRole();
            break;
        case "add an employee":
            addEmployee();
            break;
        case "update an employee role":
            updateRole();
            break;
    }
});
// GET a single candidate

async function viewDepartments(){
    db.query(`SELECT * FROM departments`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });
}

async function viewRoles(){
    db.query(`SELECT * FROM roles`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });
}

async function viewEmployees(){
    db.query(`SELECT * FROM employees`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });
}

async function viewByMgr(){
    db.query(`SELECT * FROM employees`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });
}

async function viewByDept(){
    db.query(`SELECT * FROM employees`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });
}
async function addDept(deptName){
    db.query(`INSERT INTO departments (dept_name)
    VALUES (${deptName})`);
}

async function addRole(title, salary, department_id){
    db.query(`INSERT INTO roles (title, salary, department_id)
    VALUES (${title, salary, department_id})`);
}

async function addEmployee(first_name, last_name, role_id, manager_id){
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (${first_name, last_name, role_id, manager_id})`);
}

function updateRole(){
    db.query(`ALTER TABLE candidates ADD COLUMN party_id INTEGER`);
}

function updateManager(){

}
}

