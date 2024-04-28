const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyx8zzc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // Send a ping to confirm a successful connection


        const database = client.db("craftDb").collection("craft");

        app.get('/craft', async (req, res) => {
            const cursor = database.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // app.post('/craft', async (req, res) => {
        //     const craft = req.body;
        //     console.log("Added", craft);
        //     const craftPost = await database.insertOne(craft)
        //     res.send(craftPost)
        // })

        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await database.findOne(query)
            res.send(result)
        })

        app.put('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const update = req.body;
            const updateData = {
                $set: {
                    image: update.image,
                    item: update.item,
                    category: update.category,
                    price: update.price,
                    rating: update.rating,
                    custom: update.custom,
                    process: update.process,
                    stock: update.stock,
                    description: update.description
                }
            }
            const result = await database.updateOne(filter, updateData, options)
            res.send(result)
        })

        app.delete('/craft/:id', async (req, res) => {
            const id = req.params.id
            const deleteItem = { _id: new ObjectId(id) }
            const result = await database.deleteOne(deleteItem)
            res.send(result)
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Craft server is on")
})

app.listen(port, () => {
    console.log(`Server in stunning${port}`);
})