const mysql=require("mysql2");
const db=mysql.createConnection({
    host:"localhost",
    user:"testadmin",
    password:"Leah!1234",
    database:"employee_manager"

});

module.exports=db;