const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2o6q0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect();
        console.log("Database connection succesfull.");

        const database = client.db('true_tour_mentor');
        const tourPlanCollection = database.collection('tour_plans');
        const orderCollection = database.collection('order');

        app.get('/tour-plans', async (req, res) => {
            const crusor = tourPlanCollection.find({});
            const tourPlans = await crusor.toArray();
            res.send(tourPlans);
        });

        app.post('/add-plan', async(req, res)=>{
            const newPlan = req.body;
            const cursor = await tourPlanCollection.insertOne(newPlan);
            res.json({message:"Your plan added successfully."});

        })

        app.get('/tour-plan-detail/:planId', async (req, res) => {
            const planId = req.params.planId;
            const query = { _id: ObjectId(planId) }
            const cursor = await tourPlanCollection.findOne(query);
            // console.log(cursor);
            res.json(cursor)
        })

        app.post('/add-order', async (req, res) => {
            const orderData = req.body
            console.log(orderData)
            const cursor = await orderCollection.insertOne(orderData);
            console.log('cursor result ', cursor)
            res.json({ message: "We have received your information. Soon, we will contact with you." })
        })

        app.get('/my-orders/:userEmail', async (req, res) => {
            const userEmail = req.params.userEmail;
            const query = { email: userEmail };
            console.log(query)
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);

        })

        app.delete('/remove-order/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const cursor = await orderCollection.deleteOne(query);
            res.json({ message: "your order is cancled. Pleae stay with us." });
        });

        app.get("/all-orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const allOrders = await cursor.toArray();
            res.json(allOrders);
        });

    }
    finally {
        // await client.close();
    }
};

run().catch(console.error.dir);

app.get('/', (req, res) => {
    res.send('True Tour mentor backend');
})

app.listen(port, () => console.log('server is running on port:', port));