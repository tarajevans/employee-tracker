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
            "add a department", "add a role", "add an employee", "update an employee role", "update employee's manager","quit"],
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
      break;
      case "quit":
        quit();
        break;
}
});
}
function viewDepartments(){
db.query(`SELECT dept_name FROM departments`, (err, row) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(row);
    console.log('\n\n');
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
    console.log('\n\n');
    console.log(table);
    showMainMenu();
  });
}

function viewEmployees(){
db.query(`SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.dept_name AS Department, roles.salary AS Salary, CONCAT(manager.first_name,' ', manager.last_name) AS Manager
FROM employees
LEFT JOIN employees manager on manager.id = employees.manager_id
INNER JOIN roles ON employees.role_id = roles.id
INNER JOIN departments ON departments.id = roles.department_id;`, (err, row) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(row);
    console.log('\n\n');
    console.log(table);
    showMainMenu();
    
  });
}

function viewByMgr() {
  db.query(`SELECT emp.last_name AS 'Employee Last Name', emp.first_name AS 'Employee First Name', CONCAT(mgr.first_name,' ', mgr.last_name) AS Manager
                    FROM employees emp
                    LEFT JOIN employees mgr
                    ON emp.manager_id = mgr.id
                    ORDER BY mgr.last_name, emp.last_name`, (err, res) => {
                      if (err) throw err;
                      console.log('\n\n');
                      console.table(res);
                      showMainMenu();
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
    db.promise().query(`SELECT departments.id, departments.dept_name FROM departments`).then(([rows])=>{
      let departments = rows;
      const deptChoices = departments.map(({id, dept_name}) => ({
        name: dept_name,
        value: id
      }));
    
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
      },{
        type:'list',
        name: 'dept',
        message: 'Choose a department',
        choices: deptChoices,
      }
    ]).then((role) => {
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${role.title}', ${role.salary}, ${role.dept})`, (err, row) => {
            if (err) {
              console.log(err);
            }else{
                console.log("Role Record Saved");
            }
            showMainMenu()
        });
        });
      })
}

function addEmployee(first_name, last_name, role_id, manager_id){
  let roleChoices;
  let mgrChoices;
  db.promise().query(`SELECT roles.id, roles.title FROM roles`).then(([rows]) => {
    let roles = rows;
    roleChoices = roles.map(({ id, title}) => ({
      name: title,
      value: id
    }));}).then(db.promise().query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees WHERE manager_id IS NULL`).then(([rows]) => {
      let managers = rows;
      mgrChoices = managers.map(({ id, name}) => ({
        name: name,
        value: id
      }));
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
            type: 'list',
            name: 'role_id',
            message: "select the role for this employee. (Required)",
            choices:roleChoices,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select a manager",
            choices: mgrChoices,
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
          }))
}
function updateRole(){

  db.promise().query(`SELECT roles.id, roles.title FROM roles`).then(([rows])=>{
    let roles = rows;
    const roleChoices = roles.map(({id, title}) => ({
      name: title,
      value: id
    }));

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
      type: 'list',
      name: 'role_id',
      message: "select the role for this employee. (Required)",
      choices:roleChoices,

    },
]).then((data) => {
db.query(`UPDATE employees SET role_id = '${data.role_id}' WHERE id = ${data.emp_id};`);
showMainMenu();
}
);  
})
}

function updateManager(){

  db.promise().query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees WHERE manager_id IS NULL`).then(([rows])=>{
    let managers = rows;
    const mgrChoices = managers.map(({ id, name}) => ({
      name: name,
      value: id
    }));
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
      type: 'list',
      name: 'mgr',
      message: "Please select a manager",
      choices: mgrChoices,
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
);})
}

function quit() {
  process.exit();
}