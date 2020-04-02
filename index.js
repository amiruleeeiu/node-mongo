const express=require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app=express();

const dbUser=process.env.DB_USER;
const pass=process.env.DB_PASS;

const uri = `mongodb+srv://${dbUser}:${pass}@cluster0-aksae.mongodb.net/test?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json());
let client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/fruit/banana',(req,res)=>{
    const fruit={
        "product":"banana",
        "price":1000,
        "quantity":500
    }
    res.send(fruit);
});
const users=["Amirul","Shohag","Khairul","Jibon","Rakib"];


app.get('/products',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find(12).limit(10).toArray((err,documents)=>{
            if(err){
                console.log(err.message);
                res.status(500).send({message:err})
            }
            else{
                console.log("Successfully");
                res.send(documents);
            }
        })
        
          client.close();
      });
})

app.get('/users/:id',(req,res)=>{
    const id=req.params.id;
    const user=users[id];
    console.log(req.query);
    res.send({id,user}); 
    
});
//post
app.post('/addProduct',(req,res)=>{
    const product=req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product,(err,result)=>{
            if(err){
                console.log(err.message);
                res.status(500).send({message:err})
            }
            else{
                console.log("Successfully");
                res.send(result.ops[0]);
            }
        })
        
         client.close();
      });
    
    // console.log("dara received",req.body);
})

const port=process.env.PORT;

app.listen(port,()=>console.log("Listening to port 4000"));