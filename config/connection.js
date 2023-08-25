const MongoClient = require('mongodb').MongoClient;
const state={
    db:null
}
const uri ='mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports.connect=async() =>{
    try {
        await client.connect();
        state.db = client.db(process.env.dbName)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
  
}
module.exports.get=()=>{
    return state.db;
}

