const mongoose = require('mongoose')
const dbName = "mdmdb";
const connectionURL = process.env.MONGO_URL || 'mongodb://mongo:27017/mdmdb'; 

mongoose.connect(connectionURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',()=>{
console.log(`Connected to MongoDB => ${dbName}`)
});
