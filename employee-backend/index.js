const mysql = require('mysql');
const express = require('express');
var cors = require('cors');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(cors())
var mySqlConnect = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employee_db'
});
mySqlConnect.connect((err)=>{
    if(!err)
     console.log("connection successfull");
     else
     console.log("error:"+err);
});
app.listen(3000,()=>console.log("Express is running at 3000"));

//insert data
app.post('/add',(req,res)=>{
  console.log("hello");
  console.log(req.body);
    mySqlConnect.query('INSERT INTO employee_details SET name=?,email=?,doj=?,address=?,role=?',[req.body.name,req.body.email,req.body.doj,req.body.address,req.body.role],(err,rows,fields)=>{
        if(!err){
           res.json({
            "message" : "Employee details registered"});
        }
        else
        console.log("error :"+err);
    })
});

//update data
app.post('/update',(req,res)=>{
  mySqlConnect.query(`UPDATE employee_details SET name=?,email=?,doj=?,address=?,role=? WHERE id ='${req.query.id}'`,[req.body.name,req.body.email,req.body.doj,req.body.address,req.body.role],(err,rows,fields)=>{
      if(!err){
          res.send(rows);
      }
      else
      console.log("error :"+err);
  })
});

//delete data
app.get('/delete',(req,res)=>{
  mySqlConnect.query(`DELETE FROM employee_details WHERE id='${req.query.id}'`,(err,rows,fields)=>{
      if(!err){
       console.log("deleted sucess");
       res.send(rows);
      }
      else
      console.log("error :"+err);
  })
});

//get data
app.get('/getDetails',(req,res)=>{
  mySqlConnect.query('SELECT * FROM employee_details',(err,rows,fields)=>{
      if(!err){
          res.send(rows);
      }
      else
      console.log("error :"+err);
  })
});
