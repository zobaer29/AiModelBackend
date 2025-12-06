const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmp4rva.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("aimodel");
    const modelsCollection = db.collection("models");
    const ordercollection = db.collection("orders");


    app.post("/model", async (req, res) => {
      const model = req.body;
      const result = await modelsCollection.insertOne(model);
      res.send({ success: true, insertedId: result.insertedId });
    });
  app.get("/model", async (req, res) => {
      const result = await modelsCollection.find({}).toArray();
      res.send(result);
    });


    
    app.get("/model/:id", async (req, res) => {
      const id = req.params.id;
      const model = await modelsCollection.findOne({ _id: new ObjectId(id) });
      res.send(model);
    });


     app.get("/mymodel", async (req, res) => {
      const { createdBy } = req.query;
      const query = createdBy ? { createdBy: createdBy } : {};
      const result = await modelsCollection.find(query).toArray();
      res.send(result);
    });

    // Test ping
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected ✔");
  } catch (error) {
    console.error(error);
  } finally {
    // keep the connection alive
  }
}



run().catch(console.dir);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello Developer!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
