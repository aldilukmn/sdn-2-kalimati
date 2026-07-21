const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://aldilukmn:GZgD0kY8cT4XJ5t6@cluster0.e7p6d.mongodb.net/sdn2kalimati?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('sdn2kalimati');
    const docs = await db.collection('assessment_configs').find({}).sort({createdAt: -1}).limit(1).toArray();
    console.log(JSON.stringify(docs, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
