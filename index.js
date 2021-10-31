const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('True Tour mentor backend');
})

app.listen(port, ()=>console.log('server is running on port:', port));