const router=require("express").Router();

const db=require("../../db/connection");

router.get("/departments",(req,res)=>{
    db.query(`SELECT * FROM departments`, (err, row) => {
        if (err) {
          console.log(err);
        }
        console.log(row);
      });

});

module.exports=router;