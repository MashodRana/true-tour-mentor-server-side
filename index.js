const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {MongoClient, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2o6q0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async ()=>{
    try{
        await client.connect();
        console.log("Database connection succesfull.");

        const database = client.db('true_tour_mentor');
        const tourPlanCollection = database.collection('tour_plans');

        app.get('/tour-plans', async(req, res)=>{
            const crusor = tourPlanCollection.find({});
            const tourPlans = await crusor.toArray();
            res.send(tourPlans);
        });

        app.get('/tour-plan-detail/:planId', async(req, res)=>{
            const planId = req.params.planId;
            const query = {_id:ObjectId(planId)}
            const cursor = await tourPlanCollection.findOne(query);
            // console.log(cursor);
            res.json(cursor)
        })
    }
    finally{
        // await client.close();
    }
};

run().catch(console.error.dir);

app.get('/', (req, res)=>{
    res.send('True Tour mentor backend');
})

app.listen(port, ()=>console.log('server is running on port:', port));