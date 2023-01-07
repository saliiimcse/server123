const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Assignment -11 server')
})

// pass: ZxSCOJSiaeu3uZMF
// user: assignmentten


const uri = "mongodb+srv://assignmentten:ZxSCOJSiaeu3uZMF@cluster0.wdoq5er.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');
        const reviewCollection = client.db('nodeMongoCrud').collection('review');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/homeservice', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await userCollection.findOne(query);
            res.send(book);
        })

        app.post('/service', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        });

        app.post('/review', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await reviewCollection.insertOne(user)
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const findEmail = req.query.email;
            // const email = findEmail.email;
            const query = { email: findEmail }
            // console.log(findEmail);
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/review', async (req, res) => {
            const serviceId = req.query.serviceId;
            // const email = findEmail.email;
            const query = { serviceId: serviceId }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });
        // review delete
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // console.log('trying delete', id);
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        // review update

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const updatedreview = {
                $set: {
                    review: review.text,
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedreview, option);
            res.send(result);
        })



    }
    finally {

    }
}
run().catch(error => console.log(error));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})