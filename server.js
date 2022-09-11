const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

db.connect(err => {
if(err) throw err;
console.log('database connected.');
showMainMenu();
});

function showMainMenu(){
return inquirer.prompt([
{
    type: "list",
    name: "choice",
    message: "Choose one of the following",
    choices: ["view all departments", "view all roles", "view all employees", "view all employees by manager", 
            "add a department", "add a role", "add an employee", "update an employee role", "update employee's manager"],
},
]).then((choice) => {
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

    case "view all employees by manager":
        viewByMgr();
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
    case "update employee's manager":
      updateManager();
}
});
}
function viewDepartments(){
db.query(`SELECT dept_name FROM departments`, (err, row) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(row);
    console.log(table);
    showMainMenu();
  });
}

function viewRoles(){
db.query(`SELECT roles.*, departments.dept_name AS department
FROM roles 
LEFT JOIN departments ON roles.department_id = departments.id`, (err, row) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(row);
    console.log(table);
    showMainMenu();
  });
}

function viewEmployees(){
db.query(`SELECT emp1.*, departments.dept_name AS department, roles.title AS role, emp2.first_name + ' ' + emp2.last_name AS name
FROM employees emp1, roles, departments
LEFT JOIN departments dept ON roles.department_id = dept.id
LEFT JOIN employees emp2 ON emp1.manager_id = emp2.id `, (err, row) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(row);
    console.log(table);
    showMainMenu();
    
  });
}

function viewByMgr(){
db.query(`SELECT * FROM employees`, (err, row) => {
    if (err) {
      console.log(err);
    }
    
    for (let i = 0; i < row.length; i++) {
        console.log(row[i]);
    }
  });
}

async function addDept(){
return await inquirer.prompt([
    {
        type: 'input',
        name: 'dept_name',
        message: "Enter the department name. (Required)",
        validate: deptInput => {
          if (deptInput) {
            return true;
          } else {
            console.log("You need to enter the department name");
            return false;
          }
        }
      },]).then((department) => {
        db.query(`INSERT INTO departments (dept_name) VALUES ('${department.dept_name}')`, (err, row) => {
            if (err) {
              console.log(err);
            }else{
                console.log("Department Record Saved");
            }
            showMainMenu()
        });
        });
}

function addRole(){
return inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: "Enter the title for the new role. (Required)",
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log("You need to enter the title for the new role.");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: "Enter the salary for this role. (Required)",
        validate: salaryInput => {
          if (salaryInput) {
            return true;
          } else {
            console.log("You need to enter the department name");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'dept_id',
        message: "Enter the department id for the new role. (Required)",
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log("You need to enter the department id for the new role.");
            return false;
          }
        }
      },
    ]).then((role) => {
        console.log(role);
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.dept_id})`, (err, row) => {
            if (err) {
              console.log(err);
            }else{
                console.log("Role Record Saved");
            }
            showMainMenu()
        });
        });
}

function addEmployee(first_name, last_name, role_id, manager_id){

return inquirer.prompt([
    {
        type: 'input',
        name: 'first_name',
        message: "Enter the first name of the new employee. (Required)",
        validate: fNameInput => {
          if (fNameInput) {
            return true;
          } else {
            console.log("You need to enter the first name of the new employee.");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the last name of the new employee. (Required)",
        validate: lNameInput => {
          if (lNameInput) {
            return true;
          } else {
            console.log("You need to enter the last name of the new employee.");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the role id for the new employee. (Required)",
        validate: roleInput => {
          if (roleInput) {
            return true;
          } else {
            console.log("You need to enter the role id for the new employee.");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the manager id for the new employee. (Required)",
        validate: managerInput => {
          if (managerInput) {
            return true;
          } else {
            console.log("You need to enter the manager id for the new employee.");
            return false;
          }
        }
      },
    ]).then((employee) => {
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${employee.first_name}', '${employee.last_name}', ${employee.role_id}, ${employee.manager_id})`, (err, row) => {
            if (err) {
              console.log(err);
            }else{
                console.log("Employee Record Saved");
            }
            showMainMenu()
        });
        });
}
function updateRole(){

return inquirer.prompt([
{
  type: 'input',
  name: 'emp_id',
  message: "Enter the employee id. (Required)",
  validate: empIdInput => {
    if (empIdInput) {
      return true;
    } else {
      console.log("You need to enter the employee id.");
      return false;
    }
  }
},
{
  type: 'input',
  name: 'role',
  message: "Enter the employee's role. (Required)",
  validate: roleInput => {
    if (roleInput) {
      return true;
    } else {
      console.log("You need to enter the the employee's role.");
      return false;
    }
  }
},
]).then((data) => {
db.query(`UPDATE employees SET role_id = '${data.role}' WHERE id = ${data.emp_id};`);
showMainMenu();
}
);  
}

function updateManager(){
return inquirer.prompt([
{
  type: 'input',
  name: 'emp_id',
  message: "Enter the employee id. (Required)",
  validate: empIdInput => {
    if (empIdInput) {
      return true;
    } else {
      console.log("You need to enter the employee id.");
      return false;
    }
  }
},
{
  type: 'input',
  name: 'mgr',
  message: "Enter the employee's new manager's id.(enter null for none assigned manager) (Required)",
  validate: mgrInput => {
    if (mgrInput) {
      return true;
    } else {
      console.log("You need to enter the the employee's new manager's id.");
      return false;
    }
  }
},
]).then((data) => {
let mgrId;

if (data.mgr == 'null'){
  mgrId = null;
  db.query(`UPDATE employees SET manager_id =${mgrId} WHERE id = ${data.emp_id};`);
}else if(Number.isInteger(parseInt(data.mgr))){
  mgrId = `${data.mgr}`;
  db.query(`UPDATE employees SET manager_id =${mgrId} WHERE id = ${data.emp_id};`);
}else{
  console.log("You have made an invalid entry, value must be an number or null. please try again");
  }
showMainMenu();
}
);
}