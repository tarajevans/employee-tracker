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


function showMainMenu(){
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
            console.log("view all deptments called");
            break;
        case "view all roles":
            console.log("view all roles called");
            break;
        case "view all employees":
            console.log("view all employees called");
            break;
        case "add a department":
            console.log("add a departmentcalled");
            break;
        case "add a role":
            console.log("add a role called");
            break;
        case "add an employee":
            console.log("add an employee called");
            break;
        case "update an employee role":
            console.log("update an employee role called");
            break;
    }
});
// GET a single candidate

function viewDepartments(){

}

function viewRoles(){

}

function viewEmployees(){

}

function addRole(){

}

function addEmployee(){

}

function updateRole(){

}

function updateManager(){

}
}

