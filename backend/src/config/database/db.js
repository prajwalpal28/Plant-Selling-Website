const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

mongoose.set("strictQuery", false);

const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@namastenodejs.fglhn.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNodeJS`


mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connection successful!...");
}).catch((err) => {
    console.log(`Connection failed!.... ${err}`);
});
