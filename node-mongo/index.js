const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/conFusion';


// had to add the following two lines to make the example work with mongoDB version: v3.6.5 
MongoClient.connect(url).then((client) => {
    var db = client.db('conFusion');

    console.log('Connected correctly to server');

    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "dishes")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");
        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
                            
            return db.dropCollection("dishes");
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            // mongoDB v3.x: db.close() -> client.close()
            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));

// // used in git commit: "node-mongo exercise 1"
// // had to add the following two lines to make the example work with mongoDB version: v3.6.5 
// MongoClient.connect(url, (err, client) => {
//     var db = client.db('conFusion');

//     assert.equal(err,null);

//     console.log('Connected correctly to server');

//     dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
//         "dishes", (result) => {
//             console.log("Insert Document:\n", result.ops);

//             dboper.findDocuments(db, "dishes", (docs) => {
//                 console.log("Found Documents:\n", docs);

//                 dboper.updateDocument(db, { name: "Vadonut" },
//                     { description: "Updated Test" }, "dishes",
//                     (result) => {
//                         console.log("Updated Document:\n", result.result);

//                         dboper.findDocuments(db, "dishes", (docs) => {
//                             console.log("Found Updated Documents:\n", docs);
                            
//                             db.dropCollection("dishes", (result) => {
//                                 console.log("Dropped Collection:", result);

//                                 // mongodb 3.x update db.close() -> client.close()
//                                 client.close();
//                             });
//                         });
//                     });
//             });
//     });

// });

//     // used in git commit: "node-mongo exercise 1 part a"
//     const collection = db.collection("dishes");
//     collection.insertOne({"name": "Uthappizza", "description": "test"},
//     (err, result) => {
//         assert.equal(err,null);

//         console.log("After Insert:\n");
//         console.log(result.ops);

//         collection.find({}).toArray((err, docs) => {
//             assert.equal(err,null);
            
//             console.log("Found:\n");
//             console.log(docs);

//             db.dropCollection("dishes", (err, result) => {
//                 assert.equal(err,null);

//                 // had to change db.close() to client.close()
//                 client.close();
//             });
//         });
//     });

// });


// // Keep the URL intact, but add the following variable to your connect function.
// connect.then((db) => {
//   var db = mongoose.connection;
// });