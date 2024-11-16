const { MongoClient } = require('mongodb');
require('dotenv').config();  // Make sure to load the environment variables

// MongoDB connection string from the environment variables
const DB = `mongodb+srv://${process.env.COLLECTION_NAME}:${process.env.COLLECTION_PASSWORD}@namastenodejs.fglhn.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNodeJS`;

const client = new MongoClient(DB);  // Use the DB string instead of MONGODB_URI
const dbName = 'plantselling'; // Database name
const collectionName = 'plantselling'; // Collection name

let dbInstance = null;

async function connectDB() {
    if (!dbInstance) {
        await client.connect();
        dbInstance = client.db(dbName); // Store the db instance for future reuse
    }
    return dbInstance.collection(collectionName);
}

// async function getData(userId, orderToken, key) {
//     try {
//         const collection = await connectDB();
//         const query = { userId, orderToken, key }; // Query for the document
//         const result = await collection.findOne(query); // Find the document in the collection

//         if (!result) {
//             const error = new Error(`Data not found for key - ${key}`);
//             error.statusCode = 404;
//             throw error;
//         }

//         return result.data; // Assuming the data is stored under the 'data' field

//     } catch (error) {
//         console.error('Error fetching data from MongoDB:', error);
//         throw error; // Propagate the error
//     }
// }
async function getData(userId, orderToken, key) {
    try {
        const collection = await connectDB();
        const query = { userId, orderToken, key }; // Query for the document

        console.log('Query for getData:', query); // Log the query
        const result = await collection.findOne(query); // Find the document in the collection

        if (!result) {
            console.error('Document not found for query:', query);
            const error = new Error(`Data not found for key - ${key}`);
            error.statusCode = 404;
            throw error;
        }

        return result.data; // Assuming the data is stored under the 'data' field

    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error; // Propagate the error
    }
}


async function setData(userId, token, key, data, expire) {
    try {
        const collection = await connectDB();
        const query = { userId, orderToken: token, key };

        // Set expiration by creating a field for the expiration date
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expire);

        const updateDoc = {
            $set: {
                data: data,
                expirationDate: expirationDate, // Store expiration date
            },
        };

        const options = { upsert: true }; // If document doesn't exist, insert it
        await collection.updateOne(query, updateDoc, options);

        console.log(`Data set successfully for key: ${key}`);
    } catch (error) {
        console.error('Error setting data in MongoDB:', error);
        throw error;
    }
}

async function deleteData(userId, token, key) {
    try {
        const collection = await connectDB();
        const query = { userId, orderToken: token, key }; // Find the document by userId, orderToken, and key

        const result = await collection.deleteOne(query); // Delete the document

        if (result.deletedCount === 0) {
            const error = new Error(`No document found to delete for key - ${key}`);
            error.statusCode = 404;
            throw error;
        }

        console.log(`Data deleted successfully for key: ${key}`);
    } catch (error) {
        console.error('Error deleting data from MongoDB:', error);
        throw error;
    }
}

module.exports = { getData, setData, deleteData };
